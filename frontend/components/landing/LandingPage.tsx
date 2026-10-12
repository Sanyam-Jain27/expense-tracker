"use client";

import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import DashboardPreview from "./DashboardPreview";
import FeaturesGrid from "./FeaturesGrid";
import HowItWorks from "./HowItWorks";
import TestimonialsSection from "./TestimonialsSection";
import CtaBanner from "./CtaBanner";
import Footer from "./Footer";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        <Navbar />
        <main>
          <HeroSection />
          <DashboardPreview />
          <FeaturesGrid />
          <HowItWorks />
          <TestimonialsSection />
          <CtaBanner />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LandingPage;

