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
 * conecta vecinos horizontales/verticales + una diagonal por celda (alternada).
 * Todo se calcula UNA vez, en el render del servidor (nada de recalcular por
 * frame): el resultado es un `<path>` de líneas, algunos `<polygon>` apenas
 * rellenos y una lista de nodos para los puntitos.
 */
function generarMallaPlexus(seed: number, cols: number, rows: number, ancho: number, alto: number) {
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

      if (i === cols - 1) segmentos.push([b, d]);
      if (j === rows - 1) segmentos.push([c, d]);

      if (random() > 0.88 && i + 2 <= cols && j + 1 <= rows) {
        segmentos.push([a, puntos[j + 1][i + 2]]);
      }

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

// Configuración fija: UNA sola malla para TODA la página (ya no una por
// sección), evitando cualquier costura de tono entre secciones.
const ANCHO = 960;
const ALTO = 640;
const COLS = 12;
const ROWS = 8;
const SEED = 7;
const OPACIDAD_LINEA = 0.075;
const OPACIDAD_NODO = 0.16;
const OPACIDAD_RELLENO = 0.04;

const { nodos, segmentos, triangulosRellenos } = generarMallaPlexus(SEED, COLS, ROWS, ANCHO, ALTO);
const MALLA_PATH_D = pathDeSegmentos(segmentos);

// La textura se desvanece un poco hacia el centro del viewport (donde suele
// vivir el texto), sin dejar de cubrir bordes/esquinas.
const MASK = "radial-gradient(circle at 50% 40%, transparent 0%, rgba(0,0,0,0.5) 48%, black 80%)";

/**
 * Fondo GLOBAL de toda la página: UNA sola capa fija al viewport (no se
 * repite ni se recalcula por sección), que combina:
 * 1) la malla low-poly (antes vivía dentro de cada <section> vía
 *    FondoSeccion, generando una costura de tono en cada borde entre
 *    secciones — ahora es continua, sin cortes).
 * 2) las manchas de luz muy difusas (turquesa + violeta, antes en
 *    Atmosfera).
 *
 * Se monta UNA vez en app/layout.tsx, antes del Header y del <main>.
 * `position: fixed` + sin z-index propio (auto): con eso alcanza para que
 * quede SIEMPRE detrás de cualquier contenido con z-index explícito
 * (todas las secciones envuelven su contenido real en `relative z-10`, y
 * FlightTrail usa `z-0`) sin crear un nuevo contexto de apilamiento que
 * rompa ese orden. Puramente decorativo: pointer-events-none, aria-hidden.
 * Estático salvo la deriva lentísima de `.fondo-deriva` (ya apagada por
 * completo con prefers-reduced-motion).
 */
export default function FondoGlobal() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0">
      <div
        className="fondo-deriva absolute inset-0 overflow-hidden"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox={`0 0 ${ANCHO} ${ALTO}`}
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          {triangulosRellenos.map((tri, idx) => (
            <polygon
              key={idx}
              points={tri.map((p) => `${p.x},${p.y}`).join(" ")}
              fill={
                idx % 3 === 0
                  ? `rgba(47,227,206,${OPACIDAD_RELLENO})`
                  : `rgba(234,241,244,${OPACIDAD_RELLENO})`
              }
              stroke="none"
            />
          ))}

          <path d={MALLA_PATH_D} fill="none" stroke={`rgba(234,241,244,${OPACIDAD_LINEA})`} strokeWidth="1" />

          {nodos.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={idx % 8 === 0 ? 2.6 : 1.7}
              fill={
                idx % 8 === 0
                  ? `rgba(47,227,206,${OPACIDAD_NODO + 0.02})`
                  : `rgba(234,241,244,${OPACIDAD_NODO})`
              }
            />
          ))}
        </svg>
      </div>

      {/* Manchas de luz muy difusas: turquesa + violeta, opacidad ~0.05-0.06 */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(70% 60% at 12% 10%, rgba(23,183,166,0.06) 0%, rgba(23,183,166,0) 70%)",
            "radial-gradient(70% 60% at 88% 82%, rgba(139,124,246,0.055) 0%, rgba(139,124,246,0) 70%)",
          ].join(", "),
        }}
      />
    </div>
  );
}
