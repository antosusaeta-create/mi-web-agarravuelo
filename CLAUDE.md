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

Paleta **"Despegue"** (dirección moderna y tecnológica; NO usar los colores actuales de Gama):
- Azul profundo `#0F2A43` (token `azul`) — fondos oscuros; con texto claro/arena, NUNCA tinta.
- Acento turquesa `#17B7A6` (token `turquesa`) — con texto oscuro/tinta, NUNCA blanco; como texto SOLO sobre fondo azul (sobre arena falla AA).
- Arena clara `#F5F3ED` (token `arena`) — fondo claro / texto sobre azul.
- Texto `#14202B` (token `tinta`).
- Acento secundario FUCSIA (energía/destellos, uso moderado): `#EC4899` (token `fucsia`) SOLO sobre fondo azul (texto grande); `#B21E68` (token `fucsia-oscuro`) para texto sobre fondo claro/arena.

Tipografía: display **Space Grotesk** (token `font-display`, títulos) + texto **Inter** (token `font-sans`).

**Sistema de movimiento (ya construido, reutilizar en secciones nuevas):**
- `components/Reveal.tsx` — aparición fade+subida al entrar en viewport (IntersectionObserver, con red de seguridad).
- `components/FlightTrail.tsx` — "estela de vuelo": path curvo + avión `public/avion-papel.png` (next/image) que sigue la tangente según el scroll. Decorativo (aria-hidden, pointer-events:none). Envuelve las secciones en `page.tsx`.
- `components/TrailTitle.tsx` — título que "reacciona" (cambia de color + subrayado, efecto persistente) cuando el avión lo alcanza. Color de reacción por fondo: azul→fucsia/turquesa; arena→fucsia-oscuro/azul.
- `components/Header.tsx` — navbar sticky con `public/logo.png` (fondo claro para que el logo oscuro se lea) + CTA.
- Assets: `public/avion-papel.png` (avión que vuela), `public/logo.png` (header).
- SIEMPRE respetar `prefers-reduced-motion` (deja estado final estático) y las reglas de contraste de arriba. Mobile-first. Las nuevas secciones deben usar el mismo carril/padding izquierdo (pl-10 sm:pl-12 md:pl-14 lg:px-6) para no pisar la estela.

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
