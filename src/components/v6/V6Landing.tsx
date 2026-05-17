"use client";

import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { C } from "@/lib/tokens";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/sections/Hero";
import TrustMarquee from "@/sections/TrustMarquee";
import PressStats from "@/sections/PressStats";
import HowItWorks from "@/sections/HowItWorks";
import PhoneMockupShowcase from "./PhoneMockupShowcase";
import FilmStrip from "@/sections/FilmStrip";
import BudgetEngine from "@/sections/BudgetEngine";
import RoomExplorer from "@/sections/RoomExplorer";
import StudioSection from "@/sections/StudioSection";
import MarketplaceSection from "@/sections/MarketplaceSection";
import LocationSection from "@/sections/LocationSection";
import RecommendationsPreview from "@/sections/RecommendationsPreview";
import Testimonials from "@/sections/Testimonials";
import Pricing from "@/sections/Pricing";
import FinalCTA from "@/sections/FinalCTA";

export default function V6Landing() {
  useSmoothScroll();

  return (
    <div className="bg-[#FDFAF6] text-[#0A0908] overflow-x-hidden font-[var(--font-dm-sans)]">
      {/* Page-level CSS — uses JS template literals so must stay here */}
      <style>{`
        @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
        @keyframes clipUp      { from{clip-path:polygon(0 100%,100% 100%,100% 100%,0 100%)} to{clip-path:polygon(0 0,100% 0,100% 100%,0 100%)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes float       { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes marquee     { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes shimmer     { 0%{background-position:200% center} 100%{background-position:-200% center} }
        @keyframes pulse       { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes filmScroll        { from{transform:translateX(0)}    to{transform:translateX(-50%)} }
        @keyframes filmScrollReverse { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        @keyframes kenBurns    { 0%{transform:scale(1.07) translate(0.8%,0.4%)} 100%{transform:scale(1) translate(0,0)} }
        @keyframes progressAdvance { from{width:0%} to{width:100%} }
        @keyframes heroLineIn  { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
        @keyframes riseIn      { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .do-float    { animation:float 6s ease-in-out infinite }
        .do-marquee  { animation:marquee 48s linear infinite }
        .ul-link::after { content:'';display:block;height:1px;background:${C.brass};transform:scaleX(0);transform-origin:right;transition:transform .3s cubic-bezier(.22,1,.36,1) }
        .ul-link:hover::after { transform:scaleX(1);transform-origin:left }
        .card-lift   { transition:box-shadow .35s ease,transform .35s cubic-bezier(.34,1.56,.64,1) }
        .card-lift:hover { box-shadow:0 24px 64px rgba(10,9,8,.10);transform:translateY(-4px) }
        .btn-shimmer { background:linear-gradient(110deg,${C.brass} 30%,${C.brassLight} 50%,${C.brass} 70%);background-size:200% auto;animation:shimmer 3s linear infinite }
        .hero-outline-btn { border:1px solid rgba(10,9,8,0.18);color:rgba(10,9,8,0.58);border-radius:9999px;transition:border-color .25s,color .25s,background .25s }
        .hero-outline-btn:hover { border-color:#C9974A;color:#C9974A;background:rgba(201,151,74,0.06) }
        input[type=range] { -webkit-appearance:none;height:3px;border-radius:2px;outline:none }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none;width:16px;height:16px;border-radius:50%;background:${C.brass};cursor:pointer }
      `}</style>

      {/* Paper texture — luxury print feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[200]"
        style={{
          opacity: 0.022,
          mixBlendMode: "multiply" as const,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "200px",
        }}
      />

      <Navbar />
      <Hero />
      <TrustMarquee />
      <PressStats />
      <HowItWorks />
      <PhoneMockupShowcase />
      <FilmStrip />
      <BudgetEngine />
      <RoomExplorer />
      <StudioSection />
      <MarketplaceSection />
      <LocationSection />
      <RecommendationsPreview />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />
    </div>
  );
}
