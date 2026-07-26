"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

/**
 * Botón flotante "¿Conversemos?" que aparece cuando el usuario se aleja del
 * Hero (donde ya existe el mismo botón) y desaparece cuando el Hero es
 * visible, para no duplicar el llamado a la acción en pantalla.
 */
export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const hero = document.getElementById("hero");
    // Si no existe el Hero (no debería pasar en este sitio) el botón
    // simplemente queda oculto: no hay nada que observar.
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const baseClasses =
    "fixed bottom-5 right-5 z-50 inline-flex items-center justify-center rounded-full bg-turquesa px-6 py-4 font-display text-sm font-semibold text-tinta shadow-lg shadow-black/40 transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa sm:px-7 sm:text-base";

  const visibilidadClasses = reducedMotion
    ? visible
      ? "opacity-100"
      : "pointer-events-none opacity-0"
    : `duration-500 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`;

  return (
    <a
      href="#contacto"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`${baseClasses} ${!reducedMotion ? "transition-all" : ""} ${visibilidadClasses}`}
    >
      ¿Conversemos?
    </a>
  );
}
