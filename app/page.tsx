import Hero from "@/components/Hero";
import Metodo from "@/components/Metodo";
import Servicios from "@/components/Servicios";
import SelectorModalidad from "@/components/SelectorModalidad";
import Equipo from "@/components/Equipo";
import Clientes from "@/components/Clientes";
import FlightTrail from "@/components/FlightTrail";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <FlightTrail />
      <Hero />
      <Metodo />
      <Servicios />
      <SelectorModalidad />
      <Equipo />
      <Clientes />
      <FloatingCTA />
    </main>
  );
}
