"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SignedIn, SignedOut } from "@clerk/nextjs";

const CtaBanner: React.FC = () => {
  return (
    <section className="py-20 max-w-5xl mx-auto px-6">
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-10 sm:p-14 text-center overflow-hidden shadow-2xl border border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Join 15,000+ Smart Savers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Ready to take complete control of your financial growth?
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Create your free account in under 30 seconds. No credit card required, instant access to all charts and analytics.
          </p>

          <div className="pt-2">
            <SignedOut>
              <Link
                href="/sign-up"
                className="inline-flex items-center gap-2 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Get Started in 30 Seconds</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedOut>

            <SignedIn>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95"
              >
                <span>Open Your Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </SignedIn>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(CtaBanner);

