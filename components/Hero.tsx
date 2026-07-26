"use client";

import { useState, type FormEvent } from "react";
import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";
import StaggerHeading from "@/components/StaggerHeading";

// TODO: pegar endpoint real de Formspree y activar el POST (fetch) en handleSubmit.
const FORMSPREE_ENDPOINT = ""; // TODO: pegar endpoint real de Formspree y activar el POST

/**
 * Estilo compartido de los campos: fondo oscuro translúcido, texto claro y
 * placeholder legible (contraste AA sobre el fondo real del input, no solo
 * sobre el carbón de la página). El foco visible en turquesa lo reafirma
 * aquí explícitamente además del global de globals.css.
 */
const campoClasses =
  "w-full rounded-xl border border-texto-claro/20 bg-carbon/70 px-4 py-3 text-base text-texto-claro placeholder:text-texto-claro/60 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa";

const labelClasses = "block text-sm font-semibold text-texto-claro/90";

/**
 * Hero + Contacto unificados: 2 columnas en desktop (izquierda: presentación;
 * derecha: formulario, que ahora ES el contacto principal del sitio — lleva
 * `id="contacto"`, el mismo destino de todos los botones "¿Conversemos?" y
 * del enlace "Contacto" del menú). En móvil se apilan, formulario debajo.
 *
 * El envío está deshabilitado a propósito (sin backend conectado) — ver
 * FORMSPREE_ENDPOINT. Al enviar, se muestra un aviso "próximamente" en vez
 * de simular un envío real o un falso "¡Gracias!".
 */
export default function Hero() {
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Sin conexión real todavía: no se hace fetch/POST a ningún lado.
    if (FORMSPREE_ENDPOINT) {
      // Aquí iría el fetch/POST real hacia Formspree una vez exista el endpoint.
    }

    setEnviado(true);
  }

  return (
    <section
      id="hero"
      aria-label="Presentación"
      className="pl-10 pr-6 pt-20 pb-16 sm:pl-12 sm:pt-28 sm:pb-20 md:pl-14 md:pt-32 lg:px-6 lg:pb-24"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-10">
        {/* Columna izquierda: presentación */}
        <div className="flex flex-col items-start gap-6">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
              Consultoría digital para pymes y emprendimientos
            </p>
          </Reveal>

          <Reveal delay={100}>
            {/* h1 en texto-claro; SOLO "Gana libertad." va en turquesa base,
                con un subrayado fino en fucsia (acento puntual y corto). */}
            <h1
              aria-label="Trabaja más inteligente. Gana libertad."
              className="font-display text-4xl font-semibold leading-tight text-texto-claro sm:text-5xl md:text-6xl"
            >
              <StaggerHeading
                segmentos={[
                  { texto: "Trabaja más inteligente." },
                  { texto: "Gana libertad.", className: "text-turquesa", subrayado: true },
                ]}
              />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="max-w-2xl text-lg leading-relaxed text-texto-claro/90 sm:text-xl">
              Automatizamos lo que te quita tiempo y ordenamos tus datos para que
              decidas mejor. El resultado no es solo vender más: es recuperar
              tiempo, foco y libertad para dedicarte a lo que de verdad importa.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="flex flex-col items-start gap-3 pt-2">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <a
                  href="#contacto"
                  className="animate-pulse-soft inline-flex items-center justify-center rounded-full bg-turquesa px-8 py-4 font-display text-base font-semibold text-tinta transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
                >
                  ¿Conversemos?
                </a>

                {/* Link secundario, en violeta: ancla al Método sin competir con el CTA principal. */}
                <a
                  href="#metodo"
                  className="inline-flex items-center gap-1.5 font-display text-base font-semibold text-violeta transition-colors hover:text-texto-claro hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
                >
                  Ver el método <span aria-hidden="true">↓</span>
                </a>
              </div>
              <p className="text-sm text-texto-claro/70">
                Sin costo. Sin compromiso. Solo una conversación honesta.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Columna derecha: formulario — es el contacto principal del sitio (id="contacto") */}
        <Reveal delay={300} className="w-full">
          <div
            id="contacto"
            className="tarjeta-degradado-hero w-full rounded-3xl border border-white/15 p-6 shadow-sm backdrop-blur-md sm:p-8"
          >
            <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
              Contacto
            </p>

            <TrailTitle
              as="h2"
              ariaLabel="Ahora sí, ¿conversamos?"
              className="mt-2 font-display text-2xl font-semibold sm:text-3xl"
              baseColorClassName="text-texto-claro"
              reachedColorClassName="text-turquesa-claro"
              underlineColorClassName="bg-turquesa-claro"
            >
              <StaggerHeading segmentos={[{ texto: "Ahora sí, ¿conversamos?" }]} />
            </TrailTitle>

            <p className="mt-3 text-base leading-relaxed text-texto-claro/90">
              Cuéntanos en qué etapa estás y qué necesitas resolver. Te
              respondemos con una propuesta acorde a tu proyecto. Y si aún no
              sabes bien qué necesitas, el diagnóstico inicial es gratis.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
              <div>
                <label htmlFor="lead-nombre" className={labelClasses}>
                  Nombre
                </label>
                <input
                  id="lead-nombre"
                  name="nombre"
                  type="text"
                  autoComplete="name"
                  required
                  placeholder="Tu nombre"
                  className={`mt-1.5 ${campoClasses}`}
                />
              </div>

              <div>
                <label htmlFor="lead-correo" className={labelClasses}>
                  Correo
                </label>
                <input
                  id="lead-correo"
                  name="correo"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="tu@correo.com"
                  className={`mt-1.5 ${campoClasses}`}
                />
              </div>

              <div>
                <label htmlFor="lead-mensaje" className={labelClasses}>
                  Mensaje
                </label>
                <textarea
                  id="lead-mensaje"
                  name="mensaje"
                  rows={4}
                  required
                  placeholder="Cuéntanos brevemente qué necesitas resolver"
                  className={`mt-1.5 resize-y ${campoClasses}`}
                />
              </div>

              <div className="mt-1 flex flex-col items-start gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-turquesa px-8 py-4 font-display text-base font-semibold text-tinta transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa"
                >
                  Enviar
                </button>

                {/* Región viva siempre presente (vacía al inicio) para que el
                    aviso se anuncie de forma fiable a lectores de pantalla. */}
                <p aria-live="polite" className="text-sm leading-relaxed text-turquesa">
                  {enviado
                    ? "Muy pronto podrás enviarnos tu mensaje desde aquí. Estamos terminando de conectar el formulario."
                    : ""}
                </p>
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
