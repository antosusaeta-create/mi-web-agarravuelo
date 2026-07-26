import type { ReactNode } from "react";

/**
 * Íconos dibujados a mano (inline SVG, sin librerías), estilo trazo fino.
 * Compartidos entre `Servicios` (tarjetas) y `ServicioModal` (popup), ambos
 * consumidores de la misma data en `servicios-data.ts`.
 */
export const iconos: Record<string, ReactNode> = {
  automatiza: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  ),
  datos: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M4 16l5-5 4 3 7-8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="4" cy="16" r="1.3" fill="currentColor" />
      <circle cx="9" cy="11" r="1.3" fill="currentColor" />
      <circle cx="13" cy="14" r="1.3" fill="currentColor" />
      <circle cx="20" cy="6" r="1.3" fill="currentColor" />
    </svg>
  ),
  ecommerce: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.8h7.6a2 2 0 0 0 2-1.6L20.5 8H6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9.5" cy="20" r="1.3" fill="currentColor" />
      <circle cx="17" cy="20" r="1.3" fill="currentColor" />
    </svg>
  ),
  marketing: (
    <svg viewBox="0 0 24 24" fill="none" className="size-5" aria-hidden="true">
      <path
        d="M3 10v4a1 1 0 0 0 1 1h2l7 4V5l-7 4H4a1 1 0 0 0-1 1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M18 9.5a4 4 0 0 1 0 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M13 17.5V20a1.5 1.5 0 0 1-3 0v-3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  ),
};
