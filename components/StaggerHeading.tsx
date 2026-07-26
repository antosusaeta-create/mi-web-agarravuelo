"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";

type Segmento = {
  /** Texto del tramo (se separa en palabras por espacios normales) */
  texto: string;
  /** Clase de color opcional SOLO para este tramo (ej. resaltar una frase) */
  className?: string;
  /** Dibuja un subrayado fino bajo este tramo (acento puntual, ej. fucsia). */
  subrayado?: boolean;
};

type StaggerHeadingProps = {
  segmentos: Segmento[];
};

type PalabraConIndice = {
  palabra: string;
  /** Posición (en letras) de la primera letra de esta palabra dentro del título completo */
  indiceInicial: number;
};

type SegmentoConPalabras = Segmento & { palabras: PalabraConIndice[] };

/**
 * Función pura (fuera del componente) que agrupa cada tramo con sus palabras
 * ya separadas, calculando para cada una en qué posición de letra global
 * arranca — así el retraso de cada letra se puede derivar sin mutar
 * variables durante el render del componente. Se conserva el agrupamiento
 * por tramo (en vez de aplanar todo a una sola lista de palabras) para poder
 * envolver cada tramo en su propio contenedor: necesario para que un
 * subrayado decorativo cubra justo ESE tramo y no el titular completo.
 */
function construirSegmentosConPalabras(segmentos: Segmento[]): SegmentoConPalabras[] {
  let cursor = 0;
  return segmentos.map((segmento) => {
    const palabras: PalabraConIndice[] = segmento.texto
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((palabra) => {
        const item = { palabra, indiceInicial: cursor };
        cursor += palabra.length;
        return item;
      });
    return { ...segmento, palabras };
  });
}

/**
 * Dibuja el texto de un título letra por letra para animarlas "subiendo"
 * de forma escalonada al entrar en viewport. Puramente decorativo: todo
 * el bloque queda aria-hidden (y cada letra también, por si se inspecciona
 * suelta) porque el heading que lo envuelve debe llevar su propio
 * `aria-label` con el texto completo — así el nombre accesible del heading
 * no depende de este marcado fragmentado.
 */
export default function StaggerHeading({ segmentos }: StaggerHeadingProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visto, setVisto] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const visible = reducedMotion || visto;

  useEffect(() => {
    if (reducedMotion) return;

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

    // Red de seguridad, igual que en Reveal: si el observer no dispara,
    // las letras no deben quedar ocultas.
    const timeout = window.setTimeout(() => {
      setVisto(true);
      observer.disconnect();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [reducedMotion]);

  // Tramos con sus palabras ya indexadas para el retraso escalonado global.
  const segmentosConPalabras = construirSegmentosConPalabras(segmentos);

  return (
    <span ref={ref} aria-hidden="true">
      {segmentosConPalabras.map((segmento, sIdx) => (
        <Fragment key={sIdx}>
          <span className={`relative inline-block ${segmento.className ?? ""}`}>
            {segmento.palabras.map((item, pIdx) => (
              <Fragment key={pIdx}>
                <span className="inline-block">
                  {item.palabra.split("").map((letra, lIdx) => {
                    const delay = (item.indiceInicial + lIdx) * 20;
                    return (
                      <span
                        key={lIdx}
                        aria-hidden="true"
                        className={`stagger-letter inline-block transition-all duration-500 ease-out ${
                          visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                        }`}
                        style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
                      >
                        {letra}
                      </span>
                    );
                  })}
                </span>
                {pIdx < segmento.palabras.length - 1 ? " " : ""}
              </Fragment>
            ))}
            {segmento.subrayado ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-fucsia"
              />
            ) : null}
          </span>
          {sIdx < segmentosConPalabras.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
