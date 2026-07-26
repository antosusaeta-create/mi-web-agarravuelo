"use client";

import { useRef, useState, type MouseEvent } from "react";
import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";
import StaggerHeading from "@/components/StaggerHeading";
import EquipoModal from "@/components/EquipoModal";
import { usePrefersReducedMotion } from "@/components/usePrefersReducedMotion";
import { equipo, type SocioData, type SocioId } from "@/components/equipo-data";

type Origen = { x: number; y: number };

/**
 * Sección Equipo: 3 socios en fila (desktop) / apilados (móvil). Cada foto es
 * un <button> (avatar placeholder: iniciales sobre gradiente radial en el
 * color del socio) que abre un popup con su bio completa — mismo patrón
 * data-driven y de accesibilidad que Servicios/ServicioModal.
 *
 * Iniciales en `text-tinta` (no texto-claro): sobre el color sólido del
 * centro del gradiente del avatar, tinta cumple AA (~5-6.5:1 en los 3
 * colores de marca) y texto-claro no llega a 3:1 en ninguno — por eso la
 * elección, pese a que el resto del sitio usa texto-claro como default.
 */
export default function Equipo() {
  const [socioActivoId, setSocioActivoId] = useState<SocioId | null>(null);
  const [origen, setOrigen] = useState<Origen | null>(null);
  const [lanzandoId, setLanzandoId] = useState<SocioId | null>(null);
  const triggerRefs = useRef<Partial<Record<SocioId, HTMLButtonElement | null>>>({});
  const reducedMotion = usePrefersReducedMotion();

  const socioActivo = equipo.find((s) => s.id === socioActivoId) ?? null;

  function abrirModal(socio: SocioData, event: MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const puntoOrigen: Origen = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    // Efecto "despegue": la foto se levanta un instante antes de que el
    // popup se abra desde su posición. Con movimiento reducido se salta la
    // espera (el propio CSS ya apaga la transición, no hay nada que ver).
    setLanzandoId(socio.id);
    window.setTimeout(
      () => {
        setLanzandoId(null);
        setOrigen(puntoOrigen);
        setSocioActivoId(socio.id);
      },
      reducedMotion ? 0 : 150
    );
  }

  function cerrarModal() {
    const idAbierto = socioActivoId;
    setSocioActivoId(null);
    setOrigen(null);
    // Devuelve el foco a la foto que abrió el modal.
    if (idAbierto) {
      triggerRefs.current[idAbierto]?.focus();
    }
  }

  return (
    <section
      id="equipo"
      aria-label="Equipo"
      className="pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto max-w-5xl">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-fucsia sm:text-base">
            Equipo
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h2"
            ariaLabel="Quiénes estamos detrás"
            className="mt-3 max-w-3xl font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-texto-claro"
            reachedColorClassName="text-fucsia"
            underlineColorClassName="bg-fucsia"
          >
            <StaggerHeading segmentos={[{ texto: "Quiénes estamos detrás" }]} />
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-texto-claro/90">
            Somos tres perfiles que normalmente están separados: estrategia, datos y ejecución.
            Juntos, bajo un mismo techo.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {equipo.map((socio, index) => {
            const lanzando = lanzandoId === socio.id;
            return (
              <Reveal as="li" key={socio.id} delay={300 + index * 100} className="flex justify-center">
                <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur-md">
                  {/* La foto ES el botón: abre el popup del socio (no navega). */}
                  <button
                    type="button"
                    ref={(el) => {
                      triggerRefs.current[socio.id] = el;
                    }}
                    onClick={(event) => abrirModal(socio, event)}
                    aria-haspopup="dialog"
                    aria-label={`Ver más sobre ${socio.nombre}`}
                    className={`flex size-28 shrink-0 items-center justify-center rounded-full font-display text-2xl font-bold text-tinta transition-transform duration-150 ease-out will-change-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-turquesa ${
                      lanzando ? "-translate-y-1.5 scale-105" : "translate-y-0 scale-100"
                    }`}
                    style={{
                      background: `radial-gradient(circle at 35% 30%, var(${socio.color.variable}) 0%, color-mix(in srgb, var(${socio.color.variable}) 60%, var(--carbon-tarjeta)) 60%, var(--carbon-tarjeta) 100%)`,
                    }}
                  >
                    {socio.iniciales}
                  </button>

                  <h3 className="font-display text-lg font-bold text-texto-claro">{socio.nombre}</h3>
                  <p className={`font-display text-xl font-bold ${socio.color.texto}`}>{socio.rol}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-texto-claro/80">{socio.bio}</p>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>

      {socioActivo ? (
        <EquipoModal socio={socioActivo} origen={origen} onClose={cerrarModal} />
      ) : null}
    </section>
  );
}
