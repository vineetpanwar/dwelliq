import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyDwelliq from "@/components/landing/WhyDwelliq";
import PreviewSection from "@/components/landing/PreviewSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <WhyDwelliq />
        <PreviewSection />
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
