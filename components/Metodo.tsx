import type { CSSProperties } from "react";
import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";
import StaggerHeading from "@/components/StaggerHeading";
import AvionAnillo from "@/components/AvionAnillo";

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

// Radio del anillo (en % del contenedor cuadrado). Todo se calcula en el
// servidor: no hace falta JS en el navegador para ubicar los pasos.
// FlightTrail lee este mismo número desde `data-flight-ring-radio` para
// alinear el loop del avión con el anillo real (ver más abajo).
const RADIO = 36;

function posicionEnAnillo(index: number, total: number) {
  const anguloGrados = -90 + index * (360 / total);
  const anguloRad = (anguloGrados * Math.PI) / 180;
  return {
    x: 50 + RADIO * Math.cos(anguloRad),
    y: 50 + RADIO * Math.sin(anguloRad),
  };
}

// Cuánto antes de llegar al centro exacto del paso 1 se detiene la flecha de
// cierre, para que la punta caiga cerca de su insignia/borde y no sobre el
// texto de la tarjeta.
const ADELANTO_FLECHA_GRADOS = 18;

/** Arco decorativo que vuelve del último paso hacia el primero (el ciclo recomienza) */
function arcoDeCierre(total: number) {
  const inicio = posicionEnAnillo(total - 1, total);
  const anguloFinGrados = -90 - ADELANTO_FLECHA_GRADOS;
  const anguloFinRad = (anguloFinGrados * Math.PI) / 180;
  const fin = {
    x: 50 + RADIO * Math.cos(anguloFinRad),
    y: 50 + RADIO * Math.sin(anguloFinRad),
  };
  return `M ${inicio.x} ${inicio.y} A ${RADIO} ${RADIO} 0 0 1 ${fin.x} ${fin.y}`;
}

export default function Metodo() {
  const total = pasos.length;

  return (
    <section
      id="metodo"
      aria-label="Método de trabajo"
      className="pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
    >
      <div className="relative z-10 mx-auto max-w-3xl">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-wide text-turquesa sm:text-base">
            Método Agarra Vuelo
          </p>
        </Reveal>

        <Reveal delay={100}>
          <TrailTitle
            as="h2"
            ariaLabel="Vamos al grano: así trabajamos"
            className="mt-3 font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-texto-claro"
            reachedColorClassName="text-turquesa-claro"
            underlineColorClassName="bg-turquesa-claro"
          >
            <StaggerHeading segmentos={[{ texto: "Vamos al grano: así trabajamos" }]} />
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-texto-claro/80">
            Cada negocio es distinto, pero el camino para ordenarlo es claro.
            Este es el Método Agarra Vuelo:
          </p>
        </Reveal>

        {/* Contenedor del ciclo: en móvil es una secuencia vertical normal;
            desde md se convierte en un anillo (los <li> pasan a position:absolute). */}
        <div className="relative mt-16 md:mx-auto md:aspect-square md:w-full md:max-w-[620px] md:pt-4 lg:max-w-[700px]">
          {/* Halo muy sutil detrás del medallón: solo profundidad, decorativo */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full md:block lg:h-64 lg:w-64"
            style={{
              background:
                "radial-gradient(circle, rgba(23,183,166,0.18) 0%, rgba(139,124,246,0.1) 55%, rgba(139,124,246,0) 75%)",
            }}
          />

          {/* Anillo + flecha de cierre: decorativos, solo desktop.
              data-flight-ring-radio: FlightTrail mide este elemento (getBoundingClientRect)
              para alinear el loop del avión con el anillo real. */}
          <svg
            aria-hidden="true"
            data-flight-ring-radio={String(RADIO)}
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
          >
            <defs>
              <linearGradient id="anillo-gradiente-metodo" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--turquesa)" stopOpacity="0.55" />
                <stop offset="100%" stopColor="var(--violeta)" stopOpacity="0.4" />
              </linearGradient>
              <marker
                id="flecha-ciclo-metodo"
                markerWidth="5"
                markerHeight="5"
                refX="2.5"
                refY="2.5"
                orient="auto-start-reverse"
                viewBox="0 0 5 5"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="var(--fucsia)" />
              </marker>
            </defs>
            <circle
              cx="50"
              cy="50"
              r={RADIO}
              fill="none"
              stroke="url(#anillo-gradiente-metodo)"
              strokeWidth="0.6"
              strokeDasharray="1.1 2.6"
            />
            <path
              d={arcoDeCierre(total)}
              fill="none"
              stroke="var(--fucsia)"
              strokeOpacity="0.85"
              strokeWidth="0.7"
              strokeDasharray="0.1 2.2"
              strokeLinecap="round"
              markerEnd="url(#flecha-ciclo-metodo)"
            />
          </svg>

          {/* Medallón central: vidrio oscuro (para que el texto se lea bien),
              con la palabra "MÉTODO" como protagonista y "Agarra Vuelo" debajo
              en turquesa — el avión que "orbita" el anillo (AvionAnillo, ver
              más abajo) ya cumple el rol visual del logo en el centro del ciclo. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-36 w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border border-white/15 bg-tinta/70 px-3 text-center shadow-lg shadow-black/40 backdrop-blur-md md:flex lg:h-40 lg:w-40"
          >
            <span className="font-display text-xl font-bold uppercase leading-none tracking-wide text-texto-claro lg:text-2xl">
              Método
            </span>
            <span className="font-display text-base font-semibold leading-none text-turquesa lg:text-lg">
              Agarra Vuelo
            </span>
          </div>

          {/* Avión propio del anillo: orbita el círculo ligado al scroll dentro
              de esta sección (bidireccional), solo en desktop. */}
          <AvionAnillo radioPct={RADIO} />

          <ol className="flex flex-col gap-6 md:block md:h-full md:w-full">
            {pasos.map((paso, index) => {
              const { x, y } = posicionEnAnillo(index, total);
              const esUltimo = index === total - 1;
              const nodoStyle = {
                "--tx": `${x}%`,
                "--ty": `${y}%`,
              } as CSSProperties;
              const badgeStyle = {
                "--ciclo-delay": `${index * 1.5}s`,
              } as CSSProperties;

              return (
                <li
                  key={paso.nombre}
                  style={nodoStyle}
                  className="relative z-10 md:absolute md:left-[var(--tx)] md:top-[var(--ty)] md:w-[200px] md:-translate-x-1/2 md:-translate-y-1/2 lg:w-[220px]"
                >
                  <Reveal
                    delay={300 + index * 100}
                    className="tarjeta-degradado-violeta flex gap-5 rounded-2xl border border-white/15 p-6 shadow-sm backdrop-blur-md hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 md:gap-3 md:p-4 md:hover:-translate-y-0.5"
                  >
                    <span
                      aria-hidden="true"
                      style={badgeStyle}
                      className="paso-badge font-display flex size-11 shrink-0 items-center justify-center rounded-full bg-turquesa-profundo text-lg font-bold text-texto-claro md:size-9 md:text-base"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-turquesa md:text-base">
                        {paso.nombre}
                      </h3>
                      <p className="mt-1 text-base leading-relaxed text-texto-claro/80 md:mt-0.5 md:text-xs md:leading-snug">
                        {paso.descripcion}
                      </p>
                    </div>
                  </Reveal>

                  {/* Conector / cierre de ciclo: solo en la secuencia vertical móvil */}
                  {esUltimo ? (
                    <span
                      aria-hidden="true"
                      className="mt-2 flex flex-col items-center gap-1 text-center md:hidden"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--fucsia)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                        <path d="M21 3v5h-5" />
                      </svg>
                      <span className="text-[11px] font-semibold uppercase tracking-wide text-fucsia">
                        Vuelve a empezar
                      </span>
                    </span>
                  ) : (
                    <span
                      aria-hidden="true"
                      className="absolute left-[42px] -bottom-6 h-6 w-px border-l-2 border-dashed border-texto-claro/25 md:hidden"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
