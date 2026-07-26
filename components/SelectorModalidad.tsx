"use client";

import { useId, useMemo, useState, type ReactNode } from "react";
import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";
import StaggerHeading from "@/components/StaggerHeading";

type ColorId = "violeta" | "turquesa" | "fucsia";
type ModalidadId = "asesoria" | "cotrabajo" | "todo";

type Modalidad = {
  id: ModalidadId;
  /** Rango [min, max] del slider (0-100) que activa esta modalidad */
  min: number;
  max: number;
  nombre: string;
  descripcion: string;
  /** Reparto de la ejecución, en % (suman 100) */
  participacionCliente: number;
  participacionAgarraVuelo: number;
  precio: string;
  color: ColorId;
};

/** Nombre de la variable CSS (definida en globals.css) para cada color de marca */
const VARIABLE_COLOR: Record<ColorId, string> = {
  violeta: "--violeta",
  turquesa: "--turquesa",
  fucsia: "--fucsia",
};

const MODALIDADES: Modalidad[] = [
  {
    id: "asesoria",
    min: 0,
    max: 33,
    nombre: "Asesoría",
    descripcion:
      "Te damos el diagnóstico, el plan y la dirección estratégica. Tú y tu equipo ejecutan.",
    participacionCliente: 80,
    participacionAgarraVuelo: 20,
    precio: "Tarifa fija por diagnóstico o sesiones de asesoría.",
    color: "violeta",
  },
  {
    id: "cotrabajo",
    min: 34,
    max: 66,
    nombre: "Cotrabajo",
    descripcion:
      "Trabajamos codo a codo: te entregamos las directrices y te enseñamos, pero la ejecución es de ambas partes.",
    participacionCliente: 50,
    participacionAgarraVuelo: 50,
    precio: "Por hora o bolsa de horas — tú ejecutas con nuestra guía.",
    color: "turquesa",
  },
  {
    id: "todo",
    min: 67,
    max: 100,
    nombre: "Lo hacemos todo",
    descripcion: "Nosotros implementamos de principio a fin. Tú apruebas y nosotros ejecutamos.",
    participacionCliente: 15,
    participacionAgarraVuelo: 85,
    precio: "Proyecto cerrado o retainer mensual.",
    color: "fucsia",
  },
];

/** Valor por defecto del slider: Cotrabajo, el punto medio del modelo */
const VALOR_INICIAL = 50;

/** Íconos dibujados a mano (inline SVG, sin librerías), estilo trazo fino,
 * coherente con el resto del sitio (ver components/servicios-iconos.tsx). */
const ICONOS: Record<ModalidadId, ReactNode> = {
  asesoria: (
    // Bombilla: la idea / el diagnóstico
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
      <path
        d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.45 1 1.2 1 2.1h5c0-.9.4-1.65 1-2.1A6 6 0 0 0 12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  cotrabajo: (
    // Dos personas: el trabajo en equipo
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
      <circle cx="9" cy="8" r="2.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.5" cy="9.6" r="2.1" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 19c.4-3 2.7-5 5.5-5s5.1 2 5.5 5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M14.7 14.4c2.1.3 3.7 2 4 4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  todo: (
    // Cohete: lo hacemos todo, ejecución completa
    <svg viewBox="0 0 24 24" fill="none" className="size-6" aria-hidden="true">
      <path
        d="M12 2.5c2.4 1.4 4 4 4 7.3 0 2-.5 3.7-1.3 5.2l-2.7 2.7-2.7-2.7A10.6 10.6 0 0 1 8 9.8c0-3.3 1.6-5.9 4-7.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.6" r="1.5" fill="currentColor" />
      <path
        d="M8.3 14.6 5.7 17c-.4 1.2-.5 2.6-.3 4 1.4.2 2.8.1 4-.3l2.5-2.6M15.7 14.6l2.6 2.4c.4 1.2.5 2.6.3 4-1.4.2-2.8.1-4-.3l-2.5-2.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

function obtenerModalidad(valor: number): Modalidad {
  return MODALIDADES.find((m) => valor >= m.min && valor <= m.max) ?? MODALIDADES[1];
}

type BarraProgresoProps = {
  etiqueta: string;
  porcentaje: number;
  colorVar: string;
};

/** Barrita de progreso: el ancho y el color se animan al cambiar de zona */
function BarraProgreso({ etiqueta, porcentaje, colorVar }: BarraProgresoProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-texto-claro/80">
        <span>{etiqueta}</span>
        <span className="font-display font-semibold text-texto-claro">{porcentaje}%</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full transition-[width,background-color] duration-500 ease-out"
          style={{ width: `${porcentaje}%`, backgroundColor: `var(${colorVar})` }}
        />
      </div>
    </div>
  );
}

export default function SelectorModalidad() {
  const [valor, setValor] = useState(VALOR_INICIAL);
  const modalidad = useMemo(() => obtenerModalidad(valor), [valor]);
  const colorVar = VARIABLE_COLOR[modalidad.color];
  const sliderId = useId();

  return (
    <section
      id="modalidad"
      aria-label="Modalidad de trabajo"
      className="pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
            Cómo trabajamos contigo
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h2"
            ariaLabel="Elige cuánto quieres involucrarte"
            className="mt-3 font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-texto-claro"
            reachedColorClassName="text-violeta"
            underlineColorClassName="bg-violeta"
          >
            <StaggerHeading segmentos={[{ texto: "Elige cuánto quieres involucrarte" }]} />
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-texto-claro/90">
            Mueve el control. El precio y el modelo se ajustan a tu nivel de participación.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="mt-12">
            {/* Etiquetas de zona, encima del slider */}
            <div className="flex items-start justify-between gap-2 px-1 text-xs font-semibold uppercase tracking-wide sm:text-sm">
              {MODALIDADES.map((m) => {
                const activa = m.id === modalidad.id;
                return (
                  <span
                    key={m.id}
                    className={`flex-1 text-center transition-colors duration-500 first:text-left last:text-right ${
                      activa ? "font-bold text-texto-claro" : "text-texto-claro/70"
                    }`}
                  >
                    {m.nombre}
                  </span>
                );
              })}
            </div>

            {/* Slider: gradiente violeta -> turquesa -> fucsia (ver .selector-range en globals.css) */}
            <label htmlFor={sliderId} className="sr-only">
              Nivel de participación en el trabajo
            </label>
            <input
              id={sliderId}
              type="range"
              min={0}
              max={100}
              step={1}
              value={valor}
              onChange={(e) => setValor(Number(e.target.value))}
              aria-label="Nivel de participación en el trabajo"
              aria-valuetext={modalidad.nombre}
              className="selector-range mt-4 w-full"
            />

            {/* Panel de resultado: aria-live anuncia el cambio de zona (no cada punto,
                porque el texto solo cambia realmente al cruzar a otra modalidad) */}
            <div
              aria-live="polite"
              className="mt-8 overflow-hidden rounded-3xl border border-white/15 p-6 backdrop-blur-md transition-colors duration-500 sm:p-8"
              style={{
                background: `linear-gradient(160deg, color-mix(in srgb, var(${colorVar}) 22%, transparent) 0%, var(--carbon-tarjeta) 65%)`,
              }}
            >
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border transition-colors duration-500"
                  style={{
                    color: `var(${colorVar})`,
                    borderColor: `color-mix(in srgb, var(${colorVar}) 45%, transparent)`,
                    backgroundColor: `color-mix(in srgb, var(${colorVar}) 16%, transparent)`,
                  }}
                >
                  {ICONOS[modalidad.id]}
                </span>
                <h3 className="font-display text-xl font-bold text-texto-claro transition-colors duration-500 sm:text-2xl">
                  {modalidad.nombre}
                </h3>
              </div>

              <p className="mt-4 text-base leading-relaxed text-texto-claro/90 sm:text-lg">
                {modalidad.descripcion}
              </p>

              <div className="mt-6 space-y-4">
                <BarraProgreso
                  etiqueta="Tu participación"
                  porcentaje={modalidad.participacionCliente}
                  colorVar={colorVar}
                />
                <BarraProgreso
                  etiqueta="Agarra Vuelo"
                  porcentaje={modalidad.participacionAgarraVuelo}
                  colorVar={colorVar}
                />
              </div>

              <p className="mt-6 text-sm font-semibold leading-relaxed text-texto-claro/80 sm:text-base">
                {modalidad.precio}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
