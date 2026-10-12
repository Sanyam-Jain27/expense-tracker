"use client";

import React from "react";
import { CircleDollarSign, CheckCircle2, TrendingUp, ShieldCheck, Zap, Star } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  subtitle?: string;
}

export const clerkAppearance = {
  elements: {
    rootBox: "w-full flex justify-center",
    card: "shadow-2xl border border-slate-200/80 rounded-3xl bg-white/95 backdrop-blur-xl p-6 sm:p-8 w-full max-w-md",
    formButtonPrimary:
      "bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 rounded-xl shadow-sm transition-all active:scale-[0.98]",
    headerTitle: "text-slate-900 font-bold text-2xl tracking-tight",
    headerSubtitle: "text-slate-500 text-sm",
    socialButtonsBlockButton:
      "border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-medium transition-all text-sm py-2",
    formFieldLabel: "text-slate-700 text-xs font-semibold uppercase tracking-wider",
    formFieldInput:
      "rounded-xl border-slate-200 bg-slate-50/70 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900 text-sm font-medium transition-all py-2.5",
    footerActionLink: "text-indigo-600 hover:text-indigo-700 font-semibold",
    dividerLine: "bg-slate-200",
    dividerText: "text-slate-400 text-xs font-medium uppercase",
    identityPreviewText: "text-slate-700 font-medium",
    identityPreviewEditButton: "text-indigo-600 hover:text-indigo-700",
  },
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#f8fafc]">
      {/* Left Hero & Branding Section (Hidden on mobile, prominent on desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-12 xl:p-16 flex-col justify-between relative overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white block leading-tight">
              FinTrack
            </span>
            <span className="text-xs text-indigo-300 font-medium tracking-wide">
              Intelligence in Personal Finance
            </span>
          </div>
        </div>

        {/* Center Content & Value Propositions */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-6">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Next-Generation Wealth Tracking
          </div>

          <h1 className="text-3xl xl:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Take complete control of your financial future.
          </h1>
          <p className="mt-4 text-slate-300 text-base leading-relaxed">
            {subtitle ||
              "Say goodbye to messy spreadsheets. FinTrack delivers real-time cashflow intelligence, smart budgeting, and visual spending analytics."}
          </p>

          {/* Feature Bullets */}
          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-400 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Live Cashflow Analytics</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track every income stream and expense across customizable categories.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400 mt-0.5">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Smart Savings & Diagnostics</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant visual feedback on your monthly savings rate and spending ratios.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-1 rounded-lg bg-violet-500/20 text-violet-400 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Zero Friction & Bank-Grade Security</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Encrypted authentication and seamless cloud synchronization.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof / Testimonial */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80">
          <div className="flex items-center gap-1 text-amber-400 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs text-slate-300 italic">
            &ldquo;FinTrack turned my scattered finances into crystal-clear insights in minutes. An essential dashboard for modern professionals.&rdquo;
          </p>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:p-16 relative">
        {/* Mobile Header Brand */}
        <div className="lg:hidden flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            FinTrack
          </span>
        </div>

        {/* Auth Component Wrapper */}
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

