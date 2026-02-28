import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Outcomes from "@/components/Outcomes";
import Projects from "@/components/Projects";
import Testimonials from "@/components/Testimonials";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ScrollAnimations from "@/components/ScrollAnimations";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 pt-32 md:pt-48 pb-32 relative z-50">
        <Hero />
        <Outcomes />
        <Projects />
        {/* <Testimonials /> */}
        <CTA />
      </main>
      <Footer />
      <ScrollAnimations />
    </>
  );
}
