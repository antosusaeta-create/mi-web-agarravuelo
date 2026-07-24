import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";

export default function Hero() {
  return (
    <section
      id="hero"
      aria-label="Presentación"
      className="bg-azul pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-start gap-6">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
            Consultoría digital para pymes y emprendimientos
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h1"
            className="font-display text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl"
            baseColorClassName="text-arena"
            reachedColorClassName="text-fucsia"
            underlineColorClassName="bg-fucsia"
          >
            Trabaja más inteligente. <span className="text-turquesa">Gana libertad.</span>
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="max-w-2xl text-lg leading-relaxed text-arena/90 sm:text-xl">
            Automatizamos lo que te quita tiempo y ordenamos tus datos para que
            decidas mejor. El resultado no es solo vender más: es recuperar
            tiempo, foco y libertad para dedicarte a lo que de verdad importa.
          </p>
        </Reveal>

        <Reveal delay={300}>
          <div className="flex flex-col items-start gap-3 pt-2">
            <a
              href="#contacto"
              className="animate-pulse-soft inline-flex items-center justify-center rounded-full bg-turquesa px-8 py-4 font-display text-base font-semibold text-tinta transition-colors hover:bg-azul hover:text-arena focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-arena"
            >
              ¿Conversemos?
            </a>
            <p className="text-sm text-arena/70">
              Sin costo. Sin compromiso. Solo una conversación honesta.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
