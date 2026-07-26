"use client";

import Image from "next/image";
import { useState } from "react";

const ENLACES = [
  { href: "#metodo", texto: "Método" },
  { href: "#servicios", texto: "Servicios" },
  { href: "#equipo", texto: "Equipo" },
  { href: "#contacto", texto: "Contacto" },
];

const enlaceClasses =
  "rounded px-1 py-1 font-display text-sm font-semibold text-texto-claro/80 transition-colors hover:text-turquesa-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa";

// Nota: el `display` (hidden/inline-flex) se declara POR USO, no aquí, para que
// el CTA de escritorio pueda ocultarse en móvil sin que un `inline-flex` base lo
// pise (en Tailwind v4 gana el último por orden de fuente).
const botonCtaClasses =
  "shrink-0 items-center justify-center rounded-full bg-turquesa px-5 py-2.5 font-display text-sm font-semibold text-tinta transition-colors hover:bg-azul hover:text-texto-claro focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa sm:px-6 sm:py-3 sm:text-base";

/**
 * Barra superior fija (sticky). Fondo MÁS OSCURO que el carbón de la página
 * (rgba(13,15,19,0.85) con blur real), para "despegar" el header del resto
 * del sitio. Logo en su variante blanca (logo-blanco.png), pensada para
 * leerse directo sobre este fondo más oscuro. Incluye navegación por anclas
 * + botón principal; en móvil colapsa en un menú hamburguesa accesible
 * (aria-expanded/aria-controls, cierra al elegir un enlace).
 */
export default function Header() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <header
      className="sticky top-0 z-40 border-b border-texto-claro/10 backdrop-blur"
      style={{ backgroundColor: "rgba(13, 15, 19, 0.85)" }}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <a href="#hero" className="shrink-0">
          {/* El PNG es un cuadrado con harto margen transparente arriba/abajo;
              recortamos con object-cover (el alto del contenedor ya calza con
              esa proporción real) para que se vea compacto en la barra. */}
          <div className="logo-entrada relative h-[47px] w-[130px] sm:h-[54px] sm:w-[150px] md:h-[61px] md:w-[170px]">
            <Image
              src="/logo-blanco.png"
              alt="Agarra Vuelo"
              fill
              sizes="(min-width: 768px) 170px, (min-width: 640px) 150px, 130px"
              className="object-cover object-center"
              priority
            />
          </div>
        </a>

        <nav aria-label="Navegación principal" className="hidden items-center gap-6 md:flex">
          {ENLACES.map((enlace) => (
            <a key={enlace.href} href={enlace.href} className={enlaceClasses}>
              {enlace.texto}
            </a>
          ))}
        </nav>

        <a href="#contacto" className={`hidden md:inline-flex ${botonCtaClasses}`}>
          ¿Conversemos?
        </a>
        {/* (el display del CTA lo controla `hidden md:inline-flex`; el CTA del menú móvil usa `flex` abajo) */}

        {/* Botón hamburguesa: solo móvil. Controla el panel `#menu-movil`. */}
        <button
          type="button"
          aria-expanded={menuAbierto}
          aria-controls="menu-movil"
          onClick={() => setMenuAbierto((abierto) => !abierto)}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border border-texto-claro/15 text-texto-claro transition-colors hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-turquesa md:hidden"
        >
          <span className="sr-only">{menuAbierto ? "Cerrar menú" : "Abrir menú"}</span>
          <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
            {menuAbierto ? (
              <path
                d="M6 6l12 12M18 6 6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Panel del menú móvil: colapsado por defecto, se expande al activar
          el botón hamburguesa. Cada enlace lo cierra al elegirlo. */}
      <div
        id="menu-movil"
        className={`border-t border-texto-claro/10 md:hidden ${menuAbierto ? "block" : "hidden"}`}
      >
        <nav
          aria-label="Navegación principal (móvil)"
          className="mx-auto flex max-w-5xl flex-col items-stretch gap-1 px-6 py-4"
        >
          {ENLACES.map((enlace) => (
            <a
              key={enlace.href}
              href={enlace.href}
              onClick={() => setMenuAbierto(false)}
              className={`w-full rounded-lg px-2 py-2.5 ${enlaceClasses}`}
            >
              {enlace.texto}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setMenuAbierto(false)}
            className={`mt-2 flex w-full ${botonCtaClasses}`}
          >
            ¿Conversemos?
          </a>
        </nav>
      </div>
    </header>
  );
}
