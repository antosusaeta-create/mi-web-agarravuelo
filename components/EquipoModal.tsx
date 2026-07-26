"use client";

import { useEffect, useId, useMemo, useRef, type CSSProperties } from "react";
import type { SocioData } from "@/components/equipo-data";

type EquipoModalProps = {
  socio: SocioData;
  /** Centro (coordenadas de viewport, en px) de la foto que abrió el popup:
   * el modal "sale" visualmente desde ahí. `null` si se abrió sin ese dato
   * (ej. teclado sin click) — en ese caso simplemente aparece centrado. */
  origen: { x: number; y: number } | null;
  onClose: () => void;
};

const SELECTOR_FOCUSABLES =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Popup de socio: mismo patrón accesible que ServicioModal (role="dialog",
 * aria-modal, foco atrapado, Escape/overlay/X, devuelve el foco, bloquea el
 * scroll del body) pero con un tono más distendido/cálido: header con
 * gradiente en el color del socio, avatar más grande, bloque "más sobre mí"
 * y botones LinkedIn + "¿Conversemos?".
 *
 * Efecto de entrada: el contenido se anima desde la posición de la foto que
 * lo abrió (ver --dx/--dy y `equipo-modal-origen` en globals.css). Es una
 * aproximación simple (no shared-element pixel a pixel): solo desplazamiento
 * + escala desde el punto de click hasta el centro, donde el modal reposa.
 * Con `prefers-reduced-motion`, se usa en su lugar un fade simple (reutiliza
 * `modal-overlay-entrada`, sin transform).
 */
export default function EquipoModal({ socio, origen, onClose }: EquipoModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const cerrarBtnRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();

  // Foco inicial: al abrir, el foco salta al botón de cerrar.
  useEffect(() => {
    cerrarBtnRef.current?.focus();
  }, []);

  // Bloquea el scroll del body mientras el modal está montado.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Escape cierra. Tab/Shift+Tab quedan atrapados dentro del modal.
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const nodo = dialogRef.current;
      if (!nodo) return;

      const focosables = Array.from(
        nodo.querySelectorAll<HTMLElement>(SELECTOR_FOCUSABLES)
      );
      if (focosables.length === 0) return;

      const primero = focosables[0];
      const ultimo = focosables[focosables.length - 1];

      if (event.shiftKey && document.activeElement === primero) {
        event.preventDefault();
        ultimo.focus();
      } else if (!event.shiftKey && document.activeElement === ultimo) {
        event.preventDefault();
        primero.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Desplazamiento entre la foto que abrió el modal y el centro de la
  // pantalla (donde el modal reposa, por el flex items-center/justify-center
  // del contenedor). Se resuelve una sola vez por apertura.
  const { dx, dy } = useMemo(() => {
    if (!origen || typeof window === "undefined") return { dx: 0, dy: 0 };
    return {
      dx: origen.x - window.innerWidth / 2,
      dy: origen.y - window.innerHeight / 2,
    };
  }, [origen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay: click fuera del modal cierra */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="motion-safe:animate-[modal-overlay-entrada_0.2s_ease-out] absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        style={{ "--dx": `${dx}px`, "--dy": `${dy}px` } as CSSProperties}
        className="motion-safe:animate-[equipo-modal-origen_0.4s_cubic-bezier(0.16,1,0.3,1)] motion-reduce:animate-[modal-overlay-entrada_0.2s_ease-out] relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-carbon-tarjeta shadow-2xl shadow-black/50"
      >
        <button
          ref={cerrarBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-carbon/70 text-texto-claro transition-colors hover:bg-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
        >
          <svg viewBox="0 0 24 24" fill="none" className="size-4" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6 6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Header: gradiente radial sutil en el color del socio, se disuelve
            hacia el fondo normal de la tarjeta antes de llegar al texto. */}
        <div
          className="flex flex-col items-center gap-4 rounded-t-3xl px-6 pb-8 pt-12 text-center sm:px-8"
          style={{
            background: `radial-gradient(circle at 50% 0%, color-mix(in srgb, var(${socio.color.variable}) 35%, transparent) 0%, transparent 65%)`,
          }}
        >
          {/* Avatar placeholder: mismas iniciales/gradiente que la tarjeta,
              a mayor tamaño. Iniciales en `tinta` (no texto-claro): sobre el
              color sólido del centro del gradiente, tinta cumple AA y
              texto-claro no (ver justificación en Equipo.tsx). */}
          <span
            aria-hidden="true"
            className="flex size-28 shrink-0 items-center justify-center rounded-full font-display text-3xl font-bold text-tinta sm:size-32 sm:text-4xl"
            style={{
              background: `radial-gradient(circle at 35% 30%, var(${socio.color.variable}) 0%, color-mix(in srgb, var(${socio.color.variable}) 60%, var(--carbon-tarjeta)) 60%, var(--carbon-tarjeta) 100%)`,
            }}
          >
            {socio.iniciales}
          </span>

          <div>
            <h2 id={tituloId} className="font-display text-xl font-bold text-texto-claro sm:text-2xl">
              {socio.nombre}
            </h2>
            {/* text-xl + bold: cumple AA como "texto grande" (>=18.66px) sobre
                el fondo de la tarjeta, incluso para violeta (el más ajustado
                de los 3 en contraste, ~4.3:1 en texto normal). */}
            <p className={`mt-1 font-display text-xl font-bold ${socio.color.texto}`}>{socio.rol}</p>
          </div>
        </div>

        <div className="px-6 pb-8 sm:px-8">
          <p className="text-base leading-relaxed text-texto-claro/90">{socio.bio}</p>

          {/* Placeholder editable: listo para reemplazar por una frase real */}
          <div className="mt-6 rounded-2xl border border-dashed border-texto-claro/25 p-4 text-center">
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-texto-claro/60">
              Más sobre mí (próximamente)
            </p>
            <p className="mt-2 text-sm leading-relaxed text-texto-claro/70">
              Espacio editable para una frase personal, un dato curioso o por qué hace este trabajo.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {socio.linkedin ? (
              <a
                href={socio.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 font-display text-sm font-semibold text-texto-claro transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
              >
                <IconoLinkedIn />
                LinkedIn
              </a>
            ) : (
              // TODO: reemplazar por <a href={socio.linkedin}> cuando exista el perfil real.
              <button
                type="button"
                disabled
                aria-label="LinkedIn — próximamente"
                title="Próximamente: enlace de LinkedIn"
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/15 px-6 py-3 font-display text-sm font-semibold text-texto-claro/60"
              >
                <IconoLinkedIn />
                LinkedIn
                <span className="font-normal text-texto-claro/50">· pronto</span>
              </button>
            )}

            <a
              href="#contacto"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-full bg-turquesa px-6 py-3 font-display text-sm font-semibold text-tinta transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
            >
              ¿Conversemos?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconoLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
      <path
        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
      />
    </svg>
  );
}
