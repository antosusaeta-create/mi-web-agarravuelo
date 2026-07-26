"use client";

import { useRef, useState, type CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";
import StaggerHeading from "@/components/StaggerHeading";
import ServicioModal from "@/components/ServicioModal";
import { servicios, type ServicioId } from "@/components/servicios-data";
import { iconos } from "@/components/servicios-iconos";

const chips = [
  { texto: "Elige", className: "bg-turquesa text-tinta" },
  { texto: "Combina", className: "bg-violeta text-tinta" },
  { texto: "Ajusta", className: "bg-texto-claro text-tinta" },
];

export default function Servicios() {
  const [servicioActivoId, setServicioActivoId] = useState<ServicioId | null>(null);
  const triggerRefs = useRef<Partial<Record<ServicioId, HTMLButtonElement | null>>>({});

  const servicioActivo = servicios.find((s) => s.id === servicioActivoId) ?? null;

  function cerrarModal() {
    const idAbierto = servicioActivoId;
    setServicioActivoId(null);
    // Devuelve el foco a la tarjeta que abrió el modal.
    if (idAbierto) {
      triggerRefs.current[idAbierto]?.focus();
    }
  }

  return (
    <section
      id="servicios"
      aria-label="Servicios"
      className="pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
            Servicios
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h2"
            ariaLabel="¿En qué te ayudamos?"
            className="mt-3 font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-texto-claro"
            reachedColorClassName="text-turquesa"
            underlineColorClassName="bg-turquesa"
          >
            <StaggerHeading segmentos={[{ texto: "¿En qué te ayudamos?" }]} />
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-texto-claro/90">
            Cuatro formas de que tu negocio trabaje de forma más inteligente.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {servicios.map((servicio, index) => (
            <Reveal as="li" key={servicio.id} delay={300 + index * 100}>
              {/* Tarjeta clickeable: abre el popup del servicio (modal), no navega. */}
              <button
                type="button"
                ref={(el) => {
                  triggerRefs.current[servicio.id] = el;
                }}
                onClick={() => setServicioActivoId(servicio.id)}
                aria-haspopup="dialog"
                data-activo={servicioActivoId === servicio.id}
                style={{ "--acento": servicio.color.acento } as CSSProperties}
                className={`tarjeta-servicio group flex w-full flex-col items-start gap-3 rounded-2xl border-2 p-6 text-left backdrop-blur-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa ${servicio.color.gradiente}`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-flex size-10 items-center justify-center rounded-xl border transition-colors duration-300 ${servicio.color.icono}`}
                >
                  {iconos[servicio.icono]}
                </span>
                <h3 className="font-display text-lg font-bold text-turquesa">{servicio.nombre}</h3>
                <p className="text-base leading-relaxed text-texto-claro/90">{servicio.descripcion}</p>
                <p className="text-sm italic leading-relaxed text-texto-claro/70">
                  Ideal para: {servicio.idealPara}
                </p>
              </button>
            </Reveal>
          ))}
        </ul>

        {/* "A tu medida": panel con tratamiento distinto (piezas combinables) */}
        <Reveal delay={300 + servicios.length * 100}>
          <div className="relative mt-8 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-turquesa/15 via-white/5 to-violeta/15 p-8 backdrop-blur-md sm:mt-10 sm:p-10">
            <h3 className="font-display text-xl font-bold text-texto-claro sm:text-2xl">
              A tu medida
            </h3>
            <p className="mt-2 max-w-xl text-base leading-relaxed text-texto-claro/90 sm:text-lg">
              ¿No calzas en ninguno? Armamos tu paquete combinando lo que necesites.
            </p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {chips.map((chip) => (
                <li
                  key={chip.texto}
                  className={`rounded-full px-4 py-1.5 font-display text-sm font-semibold ${chip.className}`}
                >
                  {chip.texto}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {servicioActivo ? <ServicioModal servicio={servicioActivo} onClose={cerrarModal} /> : null}
    </section>
  );
}
