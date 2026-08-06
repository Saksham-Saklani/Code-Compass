import Features from "@/src/components/Features";
import Hero from "../src/components/Hero";
import ExampleConversation from "@/src/components/ExampleConversation";
import Benefits from "@/src/components/Benefits";
import HowItWorks from "@/src/components/HowItWorks";
import FinalCTA from "@/src/components/FinalCTA";
import Footer from "@/src/components/Footer";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a]">
      <Hero />
      <HowItWorks />
      <Features />
      <ExampleConversation />
      <Benefits />
      <FinalCTA />
      <Footer />
    </div>
  );
}
