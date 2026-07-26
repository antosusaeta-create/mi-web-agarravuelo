/**
 * Atmósfera global de la página: 2 manchas de luz enormes y muy difusas
 * (una radial-gradient turquesa, una violeta; opacidad ~0.05-0.06) fijas al
 * viewport, para dar profundidad sin competir con el contenido.
 *
 * Es un elemento `position: fixed` sin z-index propio (auto): eso alcanza
 * para que se pinte SOBRE los fondos planos (bg-carbon / bg-carbon-superficie)
 * de cada <section> — que son cajas no posicionadas — pero siempre DEBAJO de
 * cualquier contenido que sí lleve z-index explícito (todas las secciones
 * envuelven su contenido real en un `relative z-10`). No hace falta ningún
 * z-index manual aquí ni tocar el resto de la maquetación.
 *
 * Puramente decorativo (pointer-events-none, aria-hidden) y 100% estático:
 * no hay animación que apagar con prefers-reduced-motion.
 */
export default function Atmosfera() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{
        background: [
          "radial-gradient(70% 60% at 12% 10%, rgba(23,183,166,0.06) 0%, rgba(23,183,166,0) 70%)",
          "radial-gradient(70% 60% at 88% 82%, rgba(139,124,246,0.055) 0%, rgba(139,124,246,0) 70%)",
        ].join(", "),
      }}
    />
  );
}
