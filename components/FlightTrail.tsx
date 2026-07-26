"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

const PLANE_SIZE = 64;
// El PNG del avión trae la punta apuntando levemente arriba-derecha
// (~15° sobre la horizontal). Este offset rota la imagen para que esa
// punta siga la tangente real del recorrido. Si el avión se ve "al revés"
// al cambiar el PNG, ajusta este número.
const TIP_OFFSET_DEG = 15;
// La estela es la ESTELA del avión: debe terminar detrás de su cola, nunca
// cruzarlo. Este es el largo (en px de recorrido, mismas unidades que
// getTotalLength) que se le "recorta" al tramo dibujado respecto de la
// posición real del avión, para que la punta del trazo quede justo tras la
// cola en vez de asomarse bajo el fuselaje o la punta.
const TRAIL_TAIL_OFFSET = PLANE_SIZE * 0.34;

/**
 * A qué distancia del borde izquierdo vive el carril, según el ancho real.
 * Desde md (≥768) el avión mide 64px, así que el centro del carril debe estar
 * al menos a PLANE_SIZE/2 + la amplitud de la ondulación del borde para que el
 * avión quepa ENTERO (no lo recorte el overflow-hidden) — de ahí los 40px.
 * En móvil/large-phone se mantiene pegado al borde (como ya estaba bien).
 */
function calcularCarrilX(ancho: number) {
  if (ancho >= 768) return 40;
  if (ancho >= 640) return 8;
  return 4;
}

/** Tramo recto con una leve ondulación (curvas suaves), para que el carril no sea una recta aburrida. */
function segmentoOndulado(desdeY: number, hastaY: number, x: number, direccionInicial: number) {
  const amplitud = 6;
  const largoSegmento = 240;

  const puntos: { x: number; y: number }[] = [{ x, y: desdeY }];
  let y = desdeY;
  let direccion = direccionInicial;
  while (y < hastaY) {
    const siguienteY = Math.min(y + largoSegmento, hastaY);
    const esUltimo = siguienteY >= hastaY;
    const px = esUltimo ? x : x + direccion * amplitud;
    puntos.push({ x: px, y: siguienteY });
    y = siguienteY;
    direccion *= -1;
  }

  let d = "";
  for (let i = 1; i < puntos.length; i++) {
    const prev = puntos[i - 1];
    const curr = puntos[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

/**
 * Construye el trazo completo: el carril recto (con leve ondulación) de
 * arriba a abajo. El Método ya no desvía este carril hacia su anillo: el
 * anillo tiene su propio avión independiente (ver AvionAnillo), que orbita
 * ligado al scroll dentro de esa sección.
 */
function construirPathD(alto: number, laneX: number) {
  if (alto <= 1) return `M ${laneX} 0 L ${laneX} ${alto}`;
  return `M ${laneX} 0${segmentoOndulado(0, alto, laneX, 1)}`;
}

/**
 * Estela de vuelo: un trazo curvo que conecta los títulos de cada sección de
 * arriba hacia abajo, con un avioncito de papel que la recorre según el
 * scroll. Decorativo: pointer-events-none, no tapa contenido.
 */
export default function FlightTrail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const totalLengthRef = useRef(0);

  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [puntoBase, setPuntoBase] = useState({ x: 0, y: 0, angulo: 90 });
  const reducedMotion = usePrefersReducedMotion();

  // Mide el ancho/alto del contenedor (abarca todas las secciones en page.tsx)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const medir = () => setDims({ width: container.offsetWidth, height: container.offsetHeight });
    const frame = requestAnimationFrame(medir);
    const ro = new ResizeObserver(medir);
    ro.observe(container);
    window.addEventListener("resize", medir);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      window.removeEventListener("resize", medir);
    };
  }, []);

  const altoSvg = dims.height || 1;
  const anchoSvg = dims.width || 1;
  const laneX = calcularCarrilX(anchoSvg);
  const pathD = construirPathD(altoSvg, laneX);

  // Recalcula el largo total del trazo cuando cambia su forma
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    totalLengthRef.current = path.getTotalLength();

    if (!reducedMotion) {
      path.style.strokeDasharray = `${totalLengthRef.current}`;
      path.style.strokeDashoffset = `${totalLengthRef.current}`;
    } else {
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "";
    }

    // Punto de referencia (arranque del trazo): sirve de posición inicial y,
    // en reduced-motion, es la posición final estática del avión ("arriba").
    // Se difiere al próximo frame para no llamar setState de forma síncrona.
    const frame = requestAnimationFrame(() => {
      const p0 = path.getPointAtLength(0);
      const p1 = path.getPointAtLength(Math.min(2, totalLengthRef.current || 0));
      const angulo = Math.atan2(p1.y - p0.y, p1.x - p0.x) * (180 / Math.PI);
      setPuntoBase({ x: p0.x, y: p0.y, angulo });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathD, reducedMotion]);

  // Progreso de scroll -> mueve el avión y "dibuja" el trazo, throttleado con rAF.
  // Se muta el DOM directamente (sin setState) para no provocar renders en cada frame.
  useEffect(() => {
    if (reducedMotion) return;

    let ticking = false;

    const actualizar = () => {
      ticking = false;
      const container = containerRef.current;
      const path = pathRef.current;
      const planeEl = planeRef.current;
      const largoTotal = totalLengthRef.current;
      if (!container || !path || !largoTotal) return;

      const rect = container.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const total = rect.height + viewportH;
      const crudo = total > 0 ? (viewportH - rect.top) / total : 0;
      const progreso = Math.min(1, Math.max(0, crudo));

      const largo = progreso * largoTotal;
      // La estela dibujada se detiene un poco antes del avión (en vez de
      // llegar hasta su centro): así el extremo del trazo queda tras la
      // cola y nunca la cruza ni la pisa.
      const largoVisible = Math.max(0, largo - TRAIL_TAIL_OFFSET);
      path.style.strokeDashoffset = `${largoTotal - largoVisible}`;

      if (planeEl) {
        const eps = 1.5;
        const antes = path.getPointAtLength(Math.max(0, largo - eps));
        const despues = path.getPointAtLength(Math.min(largoTotal, largo + eps));
        const punto = path.getPointAtLength(largo);
        const anguloRad = Math.atan2(despues.y - antes.y, despues.x - antes.x);
        const anguloDeg = anguloRad * (180 / Math.PI);

        planeEl.style.transform = `translate(${punto.x}px, ${punto.y}px) translate(-50%, -50%) rotate(${
          anguloDeg + TIP_OFFSET_DEG
        }deg)`;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(actualizar);
      }
    };

    const frame = requestAnimationFrame(actualizar);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reducedMotion, pathD]);

  // Posición/ángulo declarativos: punto de partida del trazo (arriba de todo).
  // En reduced-motion es el estado final (avión quieto); en modo animado es
  // solo el valor inicial, que el scroll (mutación directa del DOM) toma desde ahí.
  const planeEstiloInicial = {
    transform: `translate(${puntoBase.x}px, ${puntoBase.y}px) translate(-50%, -50%) rotate(${
      puntoBase.angulo + TIP_OFFSET_DEG
    }deg)`,
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${anchoSvg} ${altoSvg}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        {/* Tramo por recorrer: punteado y tenue, siempre visible como referencia */}
        <path
          d={pathD}
          fill="none"
          stroke="var(--turquesa)"
          strokeOpacity={reducedMotion ? 0.55 : 0.18}
          strokeWidth={2}
          strokeDasharray="3 9"
          strokeLinecap="round"
        />

        {/* Tramo recorrido: se "dibuja" con el scroll (o estático si reduced-motion) */}
        <path
          ref={pathRef}
          d={pathD}
          fill="none"
          stroke="var(--turquesa)"
          strokeWidth={2}
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
      </svg>

      {/* Avioncito de papel: decorativo, sigue la tangente del trazo */}
      <div
        ref={planeRef}
        className="absolute left-0 top-0 h-16 w-16 select-none"
        style={planeEstiloInicial}
      >
        <Image
          src="/avion-papel.png"
          alt=""
          width={PLANE_SIZE}
          height={PLANE_SIZE}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
