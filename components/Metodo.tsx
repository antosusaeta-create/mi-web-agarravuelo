import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";

const pasos = [
  {
    nombre: "Comprender",
    descripcion:
      "Diagnóstico inicial de tu negocio. Entendemos tu momento y tomamos la información clave. Todos en la misma página.",
  },
  {
    nombre: "Priorizar",
    descripcion:
      "Acordamos el problema o cuello de botella real a resolver: el que mueve la aguja.",
  },
  {
    nombre: "Proponer y cotizar",
    descripcion:
      "Te entregamos un plan claro: objetivos, plazos, acciones, resultados esperados e indicadores.",
  },
  {
    nombre: "Evaluar",
    descripcion:
      "Volvemos al plan: ¿qué salió bien?, ¿qué mejorar?, ¿qué probamos ahora?",
  },
  {
    nombre: "Acompañar",
    descripcion:
      "Ejecutamos junto a ti o te acompañamos en el proceso, según lo que necesites.",
  },
];

export default function Metodo() {
  return (
    <section
      id="metodo"
      aria-label="Método de trabajo"
      className="bg-arena pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-azul sm:text-base">
            Método Agarra Vuelo
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h2"
            className="mt-3 font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-azul"
            reachedColorClassName="text-fucsia-oscuro"
            underlineColorClassName="bg-fucsia-oscuro"
          >
            Vamos al grano: así trabajamos
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-tinta/80">
            Cada negocio es distinto, pero el camino para ordenarlo es claro.
            Este es el Método Agarra Vuelo:
          </p>
        </Reveal>

        <ol className="mt-12 flex flex-col gap-6">
          {pasos.map((paso, index) => (
            <Reveal
              as="li"
              key={paso.nombre}
              delay={300 + index * 100}
              className="flex gap-5 rounded-2xl border border-azul/10 bg-white/60 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md"
            >
              <span
                aria-hidden="true"
                className="font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-turquesa text-lg font-bold text-tinta"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-azul">
                  {paso.nombre}
                </h3>
                <p className="mt-1 text-base leading-relaxed text-tinta/80">
                  {paso.descripcion}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
