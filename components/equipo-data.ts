/**
 * Estructura de datos de los 3 socios de Equipo. Tanto las tarjetas
 * (Equipo.tsx) como el popup (EquipoModal.tsx) consumen ESTA data en vez de
 * tener texto hardcodeado disperso — mismo criterio data-driven que
 * `servicios-data.ts`, pensado para conectarse a un admin más adelante.
 *
 * Placeholders a reemplazar cuando exista la info real:
 * - `iniciales` + gradiente de color: hasta que haya fotos reales.
 * - `linkedin`: URL vacía ("") hasta tener el perfil real. TODO: completar.
 */
export type SocioId = "vicente" | "sebastian" | "antonia";

export type SocioColorId = "turquesa" | "violeta" | "fucsia";

export type SocioData = {
  id: SocioId;
  nombre: string;
  rol: string;
  bio: string;
  /** 2 letras para el avatar placeholder (círculo con gradiente + iniciales) */
  iniciales: string;
  color: {
    id: SocioColorId;
    /** Variable CSS de marca (ver app/globals.css), para el gradiente radial del avatar */
    variable: string;
    /** Clase Tailwind de texto: el rol se pinta en este color */
    texto: string;
  };
  /** Placeholder: aún no hay URL real. TODO: pegar el perfil real de LinkedIn. */
  linkedin: string;
};

export const equipo: SocioData[] = [
  {
    id: "vicente",
    nombre: "Vicente Astorquiza",
    rol: "Estrategia e innovación",
    bio: "Publicista y Magíster en Innovación y Emprendimiento UC. Con experiencia en gestión de proyectos y fundraising junto a emprendedores y organizaciones (entre ellas la Asociación de Emprendedores de Chile). Aporta la mirada estratégica y el método para que cada proyecto tenga foco y propósito.",
    iniciales: "VA",
    color: { id: "turquesa", variable: "--turquesa", texto: "text-turquesa" },
    linkedin: "",
  },
  {
    id: "sebastian",
    nombre: "Sebastián Ilabaca",
    rol: "Datos y análisis",
    bio: "Economista y analista de datos. Trabaja con Power BI para convertir los números de tu negocio en decisiones claras: ventas, estacionalidad y las señales que de verdad mueven la aguja.",
    iniciales: "SI",
    color: { id: "violeta", variable: "--violeta", texto: "text-violeta" },
    linkedin: "",
  },
  {
    id: "antonia",
    nombre: "Antonia Susaeta",
    rol: "Desarrollo web y automatización",
    bio: "Desarrolladora web no-code. Baja la estrategia a webs y automatizaciones que funcionan, se ven profesionales y venden.",
    iniciales: "AS",
    color: { id: "fucsia", variable: "--fucsia", texto: "text-fucsia" },
    linkedin: "",
  },
];
