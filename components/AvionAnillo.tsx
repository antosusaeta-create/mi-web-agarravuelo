"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

const TAMANO = 32;
// Mismo offset que usa FlightTrail: el PNG del avión apunta ~15° sobre la
// horizontal, así que hay que rotarlo ese tanto extra para que la punta siga
// la tangente real del recorrido.
const TIP_OFFSET_DEG = 15;

// Ángulo donde vive el paso 1 (arriba del anillo). Debe calzar con
// `posicionEnAnillo` en Metodo.tsx (mismo criterio: -90° = arriba).
const ANGULO_INICIAL = -90;

type Geometria = { cx: number; cy: number; r: number } | null;

type AvionAnilloProps = {
  /** Radio del anillo, en % del ancho del contenedor cuadrado (mismo número que usa Metodo.tsx para ubicar los pasos). */
  radioPct: number;
};

/**
 * Avión propio del anillo del Método: orbita el círculo según el scroll
 * DENTRO de esa sección (0 al entrar, 1 al salir), pasando por los 5 pasos
 * en el mismo orden y sentido que el anillo decorativo. Bidireccional: al
 * bajar avanza, al subir retrocede (es una función pura de la posición de
 * scroll, no hay estado acumulado). Solo existe en desktop (md+, donde el
 * anillo es visible); en móvil el propio contenedor queda oculto vía CSS.
 *
 * Rendimiento: la geometría del anillo (centro/radio reales, en px) se mide
 * con getBoundingClientRect solo al montar y en resize —nunca por frame—,
 * reutilizando el mismo nodo `[data-flight-ring-radio]` que ya expone
 * Metodo.tsx. Por scroll, un único rAF-throttle muta `style.transform`
 * directamente vía ref: no hay `setState` en cada frame.
 */
export default function AvionAnillo({ radioPct }: AvionAnilloProps) {
  const contenedorRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const geometriaRef = useRef<Geometria>(null);
  const anilloNodoRef = useRef<HTMLElement | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Mide la geometría real del anillo (centro y radio, en px, relativos a
  // este mismo contenedor) solo al montar y cuando cambia el tamaño.
  useEffect(() => {
    const contenedor = contenedorRef.current;
    if (!contenedor) return;

    const medir = () => {
      const nodoAnillo = document.querySelector<HTMLElement>("[data-flight-ring-radio]");
      anilloNodoRef.current = nodoAnillo;
      if (!nodoAnillo) {
        geometriaRef.current = null;
        return;
      }

      const rectAnillo = nodoAnillo.getBoundingClientRect();
      if (rectAnillo.width === 0) {
        // "hidden md:block": en móvil no hay anillo, no hay avión de anillo.
        geometriaRef.current = null;
        return;
      }

      const rectContenedor = contenedor.getBoundingClientRect();
      geometriaRef.current = {
        cx: rectAnillo.left - rectContenedor.left + rectAnillo.width / 2,
        cy: rectAnillo.top - rectContenedor.top + rectAnillo.height / 2,
        r: (radioPct / 100) * rectAnillo.width,
      };
    };

    const posicionar = (anguloDeg: number) => {
      const plane = planeRef.current;
      const geometria = geometriaRef.current;
      if (!plane) return;

      if (!geometria || geometria.r <= 0) {
        plane.style.opacity = "0";
        return;
      }

      const anguloRad = (anguloDeg * Math.PI) / 180;
      const x = geometria.cx + geometria.r * Math.cos(anguloRad);
      const y = geometria.cy + geometria.r * Math.sin(anguloRad);
      // Tangente de un recorrido horario: ángulo del radio + 90°.
      const anguloTangente = anguloDeg + 90 + TIP_OFFSET_DEG;

      plane.style.opacity = "1";
      plane.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${anguloTangente}deg)`;
    };

    medir();

    if (reducedMotion) {
      // Estático, quieto justo en el paso 1: sin órbita.
      const fijarPosicionEstatica = () => {
        medir();
        posicionar(ANGULO_INICIAL);
      };
      fijarPosicionEstatica();

      const ro = new ResizeObserver(fijarPosicionEstatica);
      ro.observe(contenedor);
      window.addEventListener("resize", fijarPosicionEstatica);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", fijarPosicionEstatica);
      };
    }

    let ticking = false;

    const actualizar = () => {
      ticking = false;
      const nodoAnillo = anilloNodoRef.current;
      if (!nodoAnillo) return;

      // El progreso se ata a la visibilidad real del ANILLO (no de toda la
      // sección): arranca recién cuando el círculo está ~50% visible
      // entrando desde abajo (rect.top a mitad de su alto por debajo del
      // borde inferior del viewport) y termina cuando el anillo ya salió
      // por completo arriba (rect.bottom en 0). Así el recorrido completo
      // 1→5 se alcanza a apreciar mientras el círculo está en pantalla.
      const rect = nodoAnillo.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const inicioY = viewportH - rect.height / 2;
      const finY = -rect.height;
      const rango = inicioY - finY;
      const crudo = rango > 0 ? (inicioY - rect.top) / rango : 0;
      const progreso = Math.min(1, Math.max(0, crudo));

      posicionar(ANGULO_INICIAL + progreso * 360);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(actualizar);
      }
    };

    const frame = requestAnimationFrame(actualizar);
    const ro = new ResizeObserver(() => {
      medir();
      actualizar();
    });
    ro.observe(contenedor);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, radioPct]);

  return (
    <div
      ref={contenedorRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 hidden md:block"
    >
      <div
        ref={planeRef}
        className="absolute left-0 top-0 h-8 w-8 select-none opacity-0"
      >
        <Image
          src="/avion-papel.png"
          alt=""
          width={TAMANO}
          height={TAMANO}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
