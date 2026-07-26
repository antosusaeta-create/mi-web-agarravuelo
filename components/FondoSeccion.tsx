type FondoSeccionProps = {
  /**
   * Densidad de la malla: es la única variación entre secciones (junto al
   * leve aclarado opcional de `bg-carbon-superficie` en el <section>). A propósito
   * NO hay variantes de color: toda la página comparte el mismo fondo
   * carbón, sin cortes duros entre secciones.
   */
  densidad?: "sutil" | "media";
  /** Semilla del generador determinista: cambia la forma de la malla entre secciones sin recalcular nada por frame (todo se resuelve una vez, en el render del servidor). */
  seed?: number;
};

type Punto = { x: number; y: number };

/** PRNG determinista (mulberry32): misma semilla, siempre el mismo resultado. Nada de Math.random(). */
function crearGeneradorDeterminista(seed: number) {
  let a = seed;
  return function random() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const redondear = (n: number) => Math.round(n * 10) / 10;

/**
 * Genera una malla "plexus" (nodos + líneas rectas formando triángulos
 * irregulares, estilo low-poly): parte de una grilla regular y desplaza
 * ("jitter") cada nodo una cantidad aleatoria pero determinista, luego
 * conecta vecinos horizontales/verticales + una diagonal por celda (alternada)
 * para que los triángulos salgan irregulares, como en las referencias de la
 * clienta. Todo se calcula UNA vez (no hay estado, no hay animación por
 * frame): el resultado es un `<path>` de líneas, algunos `<polygon>` apenas
 * rellenos y una lista de nodos para los puntitos.
 */
function generarMallaPlexus(
  seed: number,
  cols: number,
  rows: number,
  ancho: number,
  alto: number
) {
  const random = crearGeneradorDeterminista(seed);
  const cellW = ancho / cols;
  const cellH = alto / rows;
  const jitter = 0.42;

  const puntos: Punto[][] = [];
  for (let j = 0; j <= rows; j++) {
    const fila: Punto[] = [];
    for (let i = 0; i <= cols; i++) {
      const jx = (random() - 0.5) * cellW * jitter;
      const jy = (random() - 0.5) * cellH * jitter;
      fila.push({
        x: redondear(i * cellW + jx),
        y: redondear(j * cellH + jy),
      });
    }
    puntos.push(fila);
  }

  const segmentos: [Punto, Punto][] = [];
  const triangulosRellenos: Punto[][] = [];
  let contador = 0;

  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const a = puntos[j][i];
      const b = puntos[j][i + 1];
      const c = puntos[j + 1][i];
      const d = puntos[j + 1][i + 1];

      segmentos.push([a, b]);
      segmentos.push([a, c]);

      const diagonalAB_D = random() > 0.5;
      if (diagonalAB_D) {
        segmentos.push([a, d]);
      } else {
        segmentos.push([b, c]);
      }

      // Bordes derecho/inferior de la malla (si no, quedarían sin cerrar).
      if (i === cols - 1) segmentos.push([b, d]);
      if (j === rows - 1) segmentos.push([c, d]);

      // De tanto en tanto, una línea "larga" que salta una celda: rompe la
      // grilla estricta y suma el aire caótico de las referencias, sin
      // perder el determinismo (misma semilla, mismo resultado siempre).
      if (random() > 0.88 && i + 2 <= cols && j + 1 <= rows) {
        segmentos.push([a, puntos[j + 1][i + 2]]);
      }

      // Algunos triángulos apenas rellenos (muy pocos, muy tenues).
      contador++;
      if (contador % 11 === 0) {
        triangulosRellenos.push(diagonalAB_D ? [a, b, d] : [a, c, d]);
      }
    }
  }

  const nodos = puntos.flat();
  return { nodos, segmentos, triangulosRellenos };
}

function pathDeSegmentos(segmentos: [Punto, Punto][]) {
  return segmentos.map(([p1, p2]) => `M${p1.x} ${p1.y}L${p2.x} ${p2.y}`).join("");
}

/**
 * Capa decorativa de fondo: malla low-poly tipo "plexus" (nodos conectados
 * por líneas rectas formando triángulos irregulares, algunos apenas
 * rellenos), de contraste muy bajo, apenas más clara que el carbón —
 * integrada al material del fondo, no un dibujo superpuesto. Puramente
 * estética: no interactúa (pointer-events-none) y no existe para lectores
 * de pantalla (aria-hidden). Vive DETRÁS del contenido de la sección gracias
 * a CSS Grid (ambos, este y el contenido, comparten la misma celda vía
 * `[grid-area:1/1]` puesto en la <section>; el orden en el DOM decide qué
 * queda abajo) — a propósito NO usa `position: absolute` en la <section>,
 * para no crear un nuevo contexto de apilamiento que altere el orden de
 * pintado de FlightTrail (la estela ya asume que las secciones no son
 * "positioned").
 *
 * Nota de rendimiento: la malla se genera UNA sola vez, en el render del
 * servidor (nada de recalcular por frame ni por scroll). El resultado es
 * puro SVG estático: un único `<path>` para todas las líneas, unos pocos
 * `<polygon>` y un puñado de `<circle>` para los nodos.
 *
 * La textura se desvanece hacia el centro (donde suele vivir el texto) con
 * una máscara radial: casi invisible detrás del contenido, algo más
 * presente hacia bordes/esquinas.
 */
export default function FondoSeccion({ densidad = "sutil", seed = 1 }: FondoSeccionProps) {
  const esDensa = densidad === "media";

  // Viewbox fijo: el SVG usa preserveAspectRatio "slice" para cubrir la
  // sección completa (recortando sobrante) sin deformar la malla, sea cual
  // sea el tamaño real de la sección.
  const ancho = 960;
  const alto = 640;
  const cols = esDensa ? 12 : 8;
  const rows = esDensa ? 8 : 6;

  const { nodos, segmentos, triangulosRellenos } = generarMallaPlexus(
    seed,
    cols,
    rows,
    ancho,
    alto
  );

  const opacidadLinea = esDensa ? 0.1 : 0.065;
  const opacidadNodo = esDensa ? 0.2 : 0.15;
  const opacidadRelleno = esDensa ? 0.05 : 0.035;

  const mask =
    "radial-gradient(circle at 32% 42%, transparent 0%, rgba(0,0,0,0.55) 45%, black 78%)";

  return (
    <div
      aria-hidden="true"
      className="fondo-deriva pointer-events-none relative h-full w-full overflow-hidden"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox={`0 0 ${ancho} ${alto}`}
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        {triangulosRellenos.map((tri, idx) => (
          <polygon
            key={idx}
            points={tri.map((p) => `${p.x},${p.y}`).join(" ")}
            fill={
              idx % 3 === 0
                ? `rgba(47,227,206,${opacidadRelleno})`
                : `rgba(234,241,244,${opacidadRelleno})`
            }
            stroke="none"
          />
        ))}

        <path
          d={pathDeSegmentos(segmentos)}
          fill="none"
          stroke={`rgba(234,241,244,${opacidadLinea})`}
          strokeWidth="1"
        />

        {nodos.map((p, idx) => (
          <circle
            key={idx}
            cx={p.x}
            cy={p.y}
            r={idx % 8 === 0 ? 2.8 : 1.8}
            fill={
              idx % 8 === 0
                ? `rgba(47,227,206,${opacidadNodo + 0.02})`
                : `rgba(234,241,244,${opacidadNodo})`
            }
          />
        ))}
      </svg>
    </div>
  );
}
