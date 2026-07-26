import Reveal from "@/components/Reveal";

// Placeholder: mientras no hay logos reales, se muestran slots grises con
// la etiqueta "Pronto", listos para reemplazar uno por uno.
const CANTIDAD_SLOTS = 5;

// Flag de contenido: en false, la sección no se renderiza (sin logos reales
// todavía no aporta y compite visualmente sin necesidad). El componente
// sigue montado en app/page.tsx; apenas haya logos reales, cambia esto a
// `true` para reactivarla.
const MOSTRAR_CLIENTES = false;

export default function Clientes() {
  const slots = Array.from({ length: CANTIDAD_SLOTS });

  if (!MOSTRAR_CLIENTES) return null;

  return (
    <section
      id="clientes"
      aria-label="Clientes"
      className="px-6 py-16 sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-texto-claro sm:text-3xl">
            Confían en nosotros
          </h2>
        </Reveal>

        <Reveal delay={100}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-10 sm:gap-6">
            {slots.map((_, index) => (
              <li
                key={index}
                className="flex h-16 w-36 items-center justify-center rounded-xl border border-white/25 bg-white/10 font-display text-sm font-semibold text-texto-claro/70 sm:h-20 sm:w-44"
              >
                Pronto
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
