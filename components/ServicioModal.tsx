"use client";

import { useEffect, useId, useRef } from "react";
import type { ServicioData } from "@/components/servicios-data";
import { iconos } from "@/components/servicios-iconos";

type ServicioModalProps = {
  servicio: ServicioData;
  onClose: () => void;
};

const SELECTOR_FOCUSABLES =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Popup de servicio: dialog modal centrado, data-driven (consume la misma
 * data que las tarjetas de Servicios). Accesibilidad obligatoria:
 * - role="dialog" + aria-modal="true" + aria-labelledby -> el título.
 * - Foco atrapado dentro mientras está abierto (Tab/Shift+Tab ciclan).
 * - Al abrir, el foco salta al botón de cerrar. Al cerrar, quien lo montó
 *   (Servicios.tsx) devuelve el foco a la tarjeta que lo abrió.
 * - Cierra con click en el overlay, tecla Escape, o el botón X.
 * - Bloquea el scroll del body mientras está montado.
 */
export default function ServicioModal({ servicio, onClose }: ServicioModalProps) {
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
        className={`motion-safe:animate-[modal-contenido-entrada_0.25s_ease-out] relative z-10 max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-carbon-tarjeta p-6 shadow-2xl shadow-black/50 sm:p-8 ${servicio.color.gradiente}`}
      >
        <button
          ref={cerrarBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-white/15 bg-carbon/70 text-texto-claro transition-colors hover:bg-carbon focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
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

        <div className="flex items-center gap-3 pr-10">
          <span
            aria-hidden="true"
            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl border ${servicio.color.icono}`}
          >
            {iconos[servicio.icono]}
          </span>
          <div>
            <p className="font-display text-xs font-semibold uppercase tracking-wide text-turquesa">
              {servicio.categoria}
            </p>
            <h2 id={tituloId} className="font-display text-xl font-bold text-texto-claro sm:text-2xl">
              {servicio.nombre}
            </h2>
          </div>
        </div>

        {/* Placeholder de media: listo para reemplazar por video/imagen real */}
        <div className="mt-6 flex h-32 items-center justify-center rounded-2xl border border-dashed border-texto-claro/25 text-center text-sm text-texto-claro/60">
          Video o imagen — próximamente
        </div>

        <p className="mt-6 text-base leading-relaxed text-texto-claro/90">{servicio.descripcion}</p>

        {/* Placeholder de casos reales: listo para reemplazar por ejemplos futuros */}
        <div className="mt-6">
          <p className="font-display text-xs font-semibold uppercase tracking-wide text-texto-claro/60">
            Ejemplos
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((slot) => (
              <div
                key={slot}
                className="flex h-16 items-center justify-center rounded-xl border border-dashed border-texto-claro/20 text-center text-xs text-texto-claro/50"
              >
                Próximamente
              </div>
            ))}
          </div>
        </div>

        <a
          href="#contacto"
          onClick={onClose}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-turquesa px-6 py-3 font-display text-sm font-semibold text-tinta transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
        >
          ¿Conversemos de esto?
        </a>
      </div>
    </div>
  );
}
