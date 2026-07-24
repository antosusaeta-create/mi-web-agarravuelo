"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

type RevealProps = {
  children: ReactNode;
  /** Retraso en ms para escalonar apariciones */
  delay?: number;
  className?: string;
  /** Etiqueta HTML a renderizar (útil para no romper listas, ej. as="li") */
  as?: ElementType;
};

export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visto, setVisto] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const visible = prefersReducedMotion || visto;

  // Con movimiento reducido no hace falta observar nada: se muestra directo.
  useEffect(() => {
    if (prefersReducedMotion) return;

    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisto(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);

    // Red de seguridad: si el observer nunca dispara (elemento más alto que
    // el viewport, navegador raro, etc.), el contenido no debe quedar oculto.
    const timeout = window.setTimeout(() => {
      setVisto(true);
      observer.disconnect();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <Tag
        ref={ref as never}
        className={`reveal-item transition-all duration-500 ease-out ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${className}`}
        style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      >
        {children}
      </Tag>
      {/* Si no hay JS, el contenido debe verse igual (sin animación) */}
      <noscript>
        <style>{`.reveal-item{opacity:1 !important;transform:none !important;}`}</style>
      </noscript>
    </>
  );
}
