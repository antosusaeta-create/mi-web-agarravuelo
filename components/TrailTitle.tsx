"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

type TrailTitleProps = {
  children: ReactNode;
  /** Etiqueta HTML del título (h1, h2, ...) */
  as?: ElementType;
  /** Clases de tipografía/espaciado (SIN color) */
  className?: string;
  /** Clase de color antes de que "llegue el avión" */
  baseColorClassName: string;
  /** Clase de color una vez que el avión "llega" (debe cumplir contraste con el fondo) */
  reachedColorClassName: string;
  /** Clase bg-* para el subrayado que se dibuja */
  underlineColorClassName: string;
  /**
   * Nombre accesible del heading. Necesario cuando `children` es un efecto
   * decorativo (ej. StaggerHeading con letras en spans aria-hidden): sin
   * esto, el heading quedaría sin nombre accesible para lectores de pantalla.
   */
  ariaLabel?: string;
};

/**
 * Título que "reacciona" cuando el avión de la estela lo alcanza: cambia de
 * color y dibuja un subrayado, de forma permanente. Usa su propio
 * IntersectionObserver (desacoplado del cálculo exacto de la curva) para que
 * el efecto se sienta natural sin depender de una sincronía milimétrica.
 */
export default function TrailTitle({
  children,
  as: Tag = "h2",
  className = "",
  baseColorClassName,
  reachedColorClassName,
  underlineColorClassName,
  ariaLabel,
}: TrailTitleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [alcanzado, setAlcanzado] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const activo = reducedMotion || alcanzado;

  useEffect(() => {
    if (reducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAlcanzado(true);
            observer.disconnect();
          }
        });
      },
      // Se dispara cuando el título cruza la franja central de la pantalla,
      // como si el avión pasara justo por ahí.
      { threshold: 0, rootMargin: "-40% 0px -40% 0px" }
    );

    observer.observe(node);

    const timeout = window.setTimeout(() => {
      setAlcanzado(true);
      observer.disconnect();
    }, 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [reducedMotion]);

  return (
    <Tag
      ref={ref as never}
      aria-label={ariaLabel}
      className={`relative inline-block transition-colors duration-700 ease-out ${className} ${
        activo ? reachedColorClassName : baseColorClassName
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full transition-transform duration-700 ease-out ${underlineColorClassName} ${
          activo ? "scale-x-100" : "scale-x-0"
        }`}
      />
    </Tag>
  );
}
