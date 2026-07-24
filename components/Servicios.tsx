import Reveal from "@/components/Reveal";
import TrailTitle from "@/components/TrailTitle";

const pilares = [
  {
    nombre: "Automatiza — libera tiempo",
    descripcion:
      "Integraciones, automatizaciones y orden de procesos para dejar de hacer a mano lo que la tecnología puede hacer sola.",
    idealPara: "negocios que pierden horas en tareas repetitivas.",
  },
  {
    nombre: "Entiende tus datos — optimiza recursos",
    descripcion:
      "Dashboards, Power BI y análisis de ventas y estacionalidad para decidir con datos, no por intuición.",
    idealPara: "quienes quieren tomar mejores decisiones con lo que ya tienen.",
  },
  {
    nombre: "Vende mejor — web y ecommerce",
    descripcion:
      "Tiendas Shopify, sitios y soluciones no-code claras, ordenadas y pensadas para convertir.",
    idealPara: "marcas que quieren lanzar o mejorar su presencia y su tienda online.",
  },
  {
    nombre: "Difunde — marketing digital",
    descripcion:
      "Estrategia y gestión de campañas en Meta (Instagram y Facebook) e integraciones para atraer clientes con publicidad que convierte.",
    idealPara: "negocios listos para crecer con publicidad bien hecha.",
  },
];

export default function Servicios() {
  return (
    <section
      id="servicios"
      aria-label="Servicios"
      className="bg-azul pl-10 pr-6 py-24 sm:pl-12 sm:py-32 md:pl-14 lg:px-6"
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
            className="mt-3 font-display text-3xl font-semibold sm:text-4xl"
            baseColorClassName="text-arena"
            reachedColorClassName="text-turquesa"
            underlineColorClassName="bg-turquesa"
          >
            ¿En qué te ayudamos?
          </TrailTitle>
        </Reveal>

        <Reveal delay={200}>
          <p className="mt-4 text-lg leading-relaxed text-arena/90">
            Cuatro formas de que tu negocio trabaje de forma más inteligente.
          </p>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {pilares.map((pilar, index) => (
            <Reveal
              as="li"
              key={pilar.nombre}
              delay={300 + index * 100}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:shadow-black/20"
            >
              <h3 className="font-display text-lg font-bold text-turquesa">
                {pilar.nombre}
              </h3>
              <p className="text-base leading-relaxed text-arena/90">
                {pilar.descripcion}
              </p>
              <p className="text-sm italic leading-relaxed text-arena/70">
                Ideal para: {pilar.idealPara}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
