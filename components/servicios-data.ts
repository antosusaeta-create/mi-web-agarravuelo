/**
 * Estructura de datos de los 4 pilares de Servicios. Tanto las tarjetas
 * (Servicios.tsx) como el popup (ServicioModal.tsx) consumen ESTA data en vez
 * de tener texto hardcodeado disperso — pensado para conectarse a un admin
 * más adelante. Hoy, los campos que aún no existen (media, ejemplos) quedan
 * como placeholders dentro del modal, no acá.
 */
export type ServicioId = "automatiza" | "datos" | "ecommerce" | "marketing";

export type ServicioData = {
  id: ServicioId;
  /** Clave del diccionario de íconos en `servicios-iconos.tsx` */
  icono: ServicioId;
  nombre: string;
  /** Categoría/pilar, se muestra como etiqueta en el header del modal */
  categoria: string;
  descripcion: string;
  idealPara: string;
  color: {
    /** Clase de fondo degradado de la tarjeta/modal (ver globals.css) */
    gradiente: string;
    /** Clases de borde/fondo/texto de la caja redondeada del ícono */
    icono: string;
    /** Hex del acento de la tarjeta: se inyecta como var(--acento) para el
     *  estado activo (borde 2px + glow) de la tarjeta en Servicios.tsx */
    acento: string;
  };
};

export const servicios: ServicioData[] = [
  {
    id: "automatiza",
    icono: "automatiza",
    nombre: "Automatiza — libera tiempo",
    categoria: "Automatización",
    descripcion:
      "Integraciones, automatizaciones y orden de procesos para dejar de hacer a mano lo que la tecnología puede hacer sola.",
    idealPara: "negocios que pierden horas en tareas repetitivas.",
    color: {
      gradiente: "tarjeta-degradado-teal",
      icono: "border-turquesa/25 bg-turquesa/10 text-turquesa",
      acento: "#17B7A6",
    },
  },
  {
    id: "datos",
    icono: "datos",
    nombre: "Entiende tus datos — optimiza recursos",
    categoria: "Datos y análisis",
    descripcion:
      "Dashboards, Power BI y análisis de ventas y estacionalidad para decidir con datos, no por intuición.",
    idealPara: "quienes quieren tomar mejores decisiones con lo que ya tienen.",
    color: {
      gradiente: "tarjeta-degradado-violeta",
      icono: "border-violeta/30 bg-violeta/10 text-violeta",
      acento: "#8B7CF6",
    },
  },
  {
    id: "ecommerce",
    icono: "ecommerce",
    nombre: "Vende mejor — web y ecommerce",
    categoria: "Web y ecommerce",
    descripcion:
      "Tiendas Shopify, sitios y soluciones no-code claras, ordenadas y pensadas para convertir.",
    idealPara: "marcas que quieren lanzar o mejorar su presencia y su tienda online.",
    color: {
      gradiente: "tarjeta-degradado-teal-claro",
      icono: "border-turquesa-claro/30 bg-turquesa-claro/10 text-turquesa-claro",
      acento: "#7EEADC",
    },
  },
  {
    id: "marketing",
    icono: "marketing",
    nombre: "Difunde — marketing digital",
    categoria: "Marketing digital",
    descripcion:
      "Estrategia y gestión de campañas en Meta (Instagram y Facebook) e integraciones para atraer clientes con publicidad que convierte.",
    idealPara: "negocios listos para crecer con publicidad bien hecha.",
    color: {
      gradiente: "tarjeta-degradado-fucsia",
      icono: "border-fucsia/30 bg-fucsia/10 text-fucsia",
      acento: "#FF4FA3",
    },
  },
];
