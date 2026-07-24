import Hero from "@/components/Hero";
import Metodo from "@/components/Metodo";
import Servicios from "@/components/Servicios";
import FlightTrail from "@/components/FlightTrail";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col">
      <FlightTrail />
      <Hero />
      <Metodo />
      <Servicios />
      <FloatingCTA />
    </main>
  );
}
