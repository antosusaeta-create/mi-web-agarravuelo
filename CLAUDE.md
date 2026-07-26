@AGENTS.md

# Brief del proyecto — Web Agarra Vuelo

> Este archivo es el "brief": la memoria del proyecto. Describe QUÉ es el negocio,
> QUÉ hay que construir y CÓMO trabajar. Aún NO se ha tocado el diseño; esto es
> la preparación previa.

## El negocio

- **Marca:** Agarra Vuelo (antes Impulsa.digital). Consultoría digital para pymes y
  emprendimientos.
- **Gran idea / tagline:** "Trabaja más inteligente. Gana libertad." — Automatizamos para
  liberar tiempo y usamos datos para optimizar recursos, para que el cliente gane libertad.
- **Tono de voz:** cercano, claro, sin humo. "Una conversación honesta."
- **Diferencial:** 3 socios complementarios = estrategia + datos + ejecución.

### Equipo (3 socios)
- **Vicente Astorquiza** — innovación, sostenibilidad y método.
- **Sebastián Ilabaca** — economista y analista de datos (Power BI).
- **Antonia Susaeta** — desarrolladora web no-code.

### Servicios (4 pilares)
1. **Automatiza** — libera tiempo.
2. **Entiende tus datos** — optimiza recursos.
3. **Vende mejor** — web y ecommerce (Shopify / no-code).
4. **Difunde** — marketing digital (Meta Ads).

Transversal: **Método Agarra Vuelo** → comprender → priorizar → proponer → evaluar → acompañar.

### Portafolio (casos)
- **Pin Upcycling** — tienda Shopify.
- **Cotton Legs** — marketing / Meta Ads.
- **Marca personal** — automatización de RRSS.
- (Opcional, si aplica: referencia a +80 MiPymes vía Causalab.)

### Precios / planes
- Base referencial: planes **Despega / Crece / Expande**, bolsas de horas en UF
  (fuente: PDF `Impulsa_Digital_tablas_referenciales`).
- **Pendiente:** confirmar cifras finales y si se muestran en la landing v1.

### Contacto y canales
- Correo, Instagram, LinkedIn, WhatsApp.
- **Pendiente:** completar los datos/enlaces exactos antes de la sección de contacto.

## Estado técnico actual (NO recrear)

- Next.js (App Router + TypeScript + Tailwind v4), en `~/Proyectos/mi-web`.
- Ya en GitHub y conectado a Vercel (publica solo al hacer `git push`).
- Repo objetivo: github.com/antosusaeta-create/mi-web-agarravuelo.
- Hoy tiene la plantilla por defecto; se reemplazará contenido y diseño.

## Diseño (ya elegido — NO proponer otra paleta)

**DIRECCIÓN DEFINITIVA: base OSCURA "carbón + jerarquía"** (reemplazó a la dirección clara "Despegue sobre arena" — el fondo claro `arena` quedó DESCARTADO). Paleta EXTENDIDA con jerarquía (el flúor plano #2FE3CE/#FF5CB1 quedó atrás):
- Carbón en 3 NIVELES (profundidad de capas: fondo < superficie < tarjeta): `carbon` #121317 (fondo página), `carbon-superficie` #171A20 (superficies/zonas), `carbon-tarjeta` #1D2129 (tarjetas).
- Texto claro `#EAF1F4` (token `texto-claro`).
- Turquesa en 3 tonos: `turquesa-claro` #7EEADC (detalles finos, links, líneas), `turquesa` BASE #17B7A6 (botones y acentos principales), `turquesa-profundo` #0E5F57 (superficies/bordes/fondos de insignias — NO texto; sobre él va texto claro).
- `fucsia` #FF4FA3 = color "PREMIO": SOLO el/los aviones, algún destello y 1-2 highlights puntuales. NO en chips/subrayados/íconos.
- `violeta` #8B7CF6 (token nuevo) — íconos secundarios, gradientes y transiciones turquesa↔fucsia.
- Tinta `#14202B` (token `tinta`) — solo para texto sobre rellenos brillantes (turquesa base).
- Regla de contraste (AA siempre): sobre carbón/superficie → texto claro o turquesa-claro; botones = relleno turquesa base + texto tinta; insignias = relleno turquesa-profundo + texto/número CLARO (tinta NO pasa sobre teal profundo). Nada de texto oscuro sobre fondos oscuros.
- Textura de fondo LOW-POLY / "plexus" (malla de triángulos con nodos, muy tenue, `components/FondoSeccion.tsx`) + 2-3 manchas de luz difusas (radial-gradients enormes teal/violeta, opacidad bajísima) para dar atmósfera. Varía densidad entre secciones.
- Tarjetas: GLASS (semitranslúcido + backdrop-blur + borde) con gradiente sutil (teal-profundo/violeta→carbon-tarjeta); hover sube + sombra + el ícono cambia de color. Solo donde el texto cumpla AA.

Tipografía: display **Space Grotesk** (token `font-display`, títulos) + texto **Inter** (token `font-sans`).

**Sistema de movimiento (ya construido, reutilizar en secciones nuevas):**
- `components/Reveal.tsx` — aparición fade+subida al entrar en viewport (IntersectionObserver, con red de seguridad).
- `components/FlightTrail.tsx` — "estela de vuelo": path curvo + avión `public/avion-papel.png` (next/image) que sigue la tangente según el scroll. Decorativo (aria-hidden, pointer-events:none). Envuelve las secciones en `page.tsx`.
- `components/TrailTitle.tsx` — título que "reacciona" (cambia de color + subrayado) cuando el avión lo alcanza. Sobre carbón, reacción a turquesa/fucsia flúor.
- `components/StaggerHeading.tsx` — títulos con letras que suben escalonadas al entrar en viewport (aria-label con texto completo; letras aria-hidden). Se combina con TrailTitle.
- `components/Header.tsx` — navbar sticky con `public/logo.png` + CTA; animación de entrada del logo (`.logo-entrada`).
- `components/Clientes.tsx` — banda "Confían en nosotros" con slots placeholder "Pronto" (reemplazar por logos reales cuando existan).
- `components/FondoSeccion.tsx` — textura de fondo LOW-POLY / "plexus" (malla de triángulos con nodos, muy tenue, decorativa; SVG estático determinista). Reemplazó a las ondas/escama.
- `components/AvionAnillo.tsx` — segundo avión que ORBITA el anillo del Método, ligado al scroll (bidireccional), solo desktop. El avión LATERAL (en FlightTrail) baja recto por el carril y va al doble de tamaño.
- `components/FormularioLead.tsx` — formulario de lead (glass), sección `id="contacto"` (los CTA "¿Conversemos?" aterrizan ahí). Envío NO conectado: hay un `FORMSPREE_ENDPOINT = ""` con TODO; falta el endpoint real de Formspree de la clienta para activar el POST.
- Assets/logos: `public/avion-papel.png` (avión que vuela). Logos: `public/logo-turquesa.png` (header, sobre carbón, sin pastilla), `public/logo-sin-avion.png` (centro del medallón del Método), `public/logo-blanco.png` (alternativa monocroma), `public/logo.png` (original, texto oscuro — no usar sobre carbón).
- SIEMPRE respetar `prefers-reduced-motion` (deja estado final estático) y las reglas de contraste de arriba. Mobile-first. Las nuevas secciones deben usar el mismo carril/padding izquierdo (pl-10 sm:pl-12 md:pl-14 lg:px-6) para no pisar la estela.

**Estructura actual de la página** (`app/page.tsx`, orden): Header (sticky, `logo-blanco.png`, menú Método/Servicios/Equipo/Contacto + CTA; hamburguesa accesible en móvil) → Hero (2 columnas: contenido izq + FORMULARIO de contacto der, `id="contacto"`; el form es el contacto único, envío sin conectar) → Método (círculo, centro texto "MÉTODO/Agarra Vuelo", `AvionAnillo` orbita el anillo) → Servicios (4 tarjetas clickeables, estado activo temporal borde 2px+glow en `var(--acento)` por tarjeta, abren `ServicioModal`) → SelectorModalidad (`id="modalidad"`, termómetro slider) → Equipo (`id="equipo"`, 3 socios, foto abre `EquipoModal`) → Clientes (oculto por flag `MOSTRAR_CLIENTES`). Fondo: `components/FondoGlobal.tsx` = UNA capa fija continua (malla low-poly + manchas de luz); las secciones son TRANSPARENTES (no repetir fondo por sección). Datos de tarjetas/socios en `servicios-data.ts` / `equipo-data.ts` (data-driven). Modales comparten patrón a11y (foco atrapado, aria-modal, Escape/overlay/X, devuelve foco).

El copy final lo entrega la clienta (Antonia); adaptarlo a componentes, **no inventar textos**.

**Fuente de verdad del contenido (NO inventar, usar textualmente):**
- Copy de cada sección: [`docs/6-Copy-landing-AgarraVuelo.md`](docs/6-Copy-landing-AgarraVuelo.md)
- Posicionamiento, tono y estrategia: [`docs/5-Posicionamiento-AgarraVuelo.md`](docs/5-Posicionamiento-AgarraVuelo.md)

## Alcance

**v1 (esta web) = SOLO la landing de la consultoría:**
comunica la gran idea → 4 servicios → equipo (3 socios) → portafolio → captura de leads
con formulario simple. Publicación gratuita en Vercel (Hobby). Sin Supabase por ahora
(leads a método simple: correo / Formspree / Google Sheet, a definir en la fase de contacto).

**Fase 2 del negocio (NO construir ahora):**
curso web con módulos/avance, panel `/admin` de gestión (leads/métricas/socios) y chatbot Gemini.

**Backlog de la landing (anotado, NO construir hasta pedirlo — ref: `docs/7-Direccion-visual-movimiento.md`):**
- Sección **Equipo** (Fase 4): los 3 socios (foto, rol, una línea).
- Migrar contenido restante de la web actual: **portafolio con imágenes**, **catálogo/planes con PDF descargable**, lista larga de servicios **"¿Más concreto?"**, y **FAQ**.
- **Formspree**: pegar el endpoint real en `FormularioLead.tsx` (`FORMSPREE_ENDPOINT`) y activar el POST (hoy el envío está en estado "próximamente").
- **Banda de clientes**: oculta tras flag `MOSTRAR_CLIENTES`; activar cuando haya logos reales.

## Reglas de trabajo (IMPORTANTE)

1. **Trabaja en FASES.** Al final de cada fase, resume en 3 líneas qué se hizo y pide
   aprobación antes de continuar. No avanzar de fase sin confirmación.
2. **Mobile-first:** diseñar primero para móvil, luego escalar a desktop. Todo responsive.
3. **Optimiza tokens:** no reescribir código ya generado; referenciar archivos existentes.
4. **Simplicidad y mantenibilidad** por sobre features avanzadas no pedidas.
5. **Componentes reutilizables + Tailwind.** Evitar librerías pesadas innecesarias.
6. **Secretos** (API keys) SIEMPRE en variables de entorno (`.env`), nunca en código ni commits.
7. **La clienta es principiante:** tras cada fase, explicar "la lógica en simple" en 2-4 frases.
8. **Verifica con `npm run build`** antes de dar una fase por terminada.

## Agentes de Claude Code a usar

- `constructor-web-next` → construir/editar secciones y componentes (Next.js + Tailwind).
- `auditor-frontend` → revisar cada sección (bugs, responsividad, accesibilidad, contraste).
- (Fase 2) `integrador-datos` (Gemini/Supabase), `auditor-flujos` (flujo del bot).

## Plan de fases (solo la landing v1)

- **FASE 1 — Base visual:** paleta "Despegue" + tipografías (Space Grotesk + Inter) en Tailwind. Mobile-first.
- **FASE 2 — Hero + Método:** gran idea, CTA "¿Conversemos?", Método Agarra Vuelo (5 pasos).
- **FASE 3 — Servicios:** los 4 pilares.
- **FASE 4 — Equipo:** los 3 socios (foto, rol, una línea). Clave para credibilidad.
- **FASE 5 — Portafolio + Contacto:** casos + formulario de lead simple (sin Supabase).
- **FASE 6 — SEO y performance:** metadata, sitemap, next/image, objetivo Lighthouse > 90.
- **FASE 7 — Publicación:** verificar git config, `npm run build` sin errores, push (Vercel publica solo).

Tras cada fase, pasar por `auditor-frontend` y pedir aprobación antes de continuar.
