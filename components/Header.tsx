import Image from "next/image";

/**
 * Barra superior fija (sticky). Fondo claro para que el logo (texto oscuro)
 * se lea bien. El botón repite el mismo patrón de contraste que el resto del
 * sitio (turquesa + texto tinta).
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-azul/10 bg-arena/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <a href="#hero" className="shrink-0">
          {/* El PNG es un cuadrado con harto margen transparente arriba/abajo;
              recortamos con object-cover para que se vea compacto en la barra. */}
          <div className="relative h-12 w-32 sm:h-14 sm:w-36">
            <Image
              src="/logo.png"
              alt="Agarra Vuelo"
              fill
              sizes="(min-width: 640px) 144px, 128px"
              className="object-cover object-center"
              priority
            />
          </div>
        </a>

        <a
          href="#contacto"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-turquesa px-5 py-2.5 font-display text-sm font-semibold text-tinta transition-colors hover:bg-azul hover:text-arena focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azul sm:px-6 sm:py-3 sm:text-base"
        >
          ¿Conversemos?
        </a>
      </div>
    </header>
  );
}
