"use client";

import React, { memo } from "react";
import {
  TrendingUp,
  PieChart,
  Zap,
  Search,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Instant 2-Click Entry",
    description:
      "Record any expense or income stream in seconds with custom emoji icons, pre-built categories, and date pickers.",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
  {
    icon: TrendingUp,
    title: "Cashflow Intelligence",
    description:
      "Visualize your monthly cash flow with interactive Highcharts column and line charts that compare inflow vs. outflow.",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
  },
  {
    icon: PieChart,
    title: "Category Breakdown",
    description:
      "Interactive donut charts pinpoint where every dollar goes so you can eliminate subscription creep and wasteful spending.",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
  },
  {
    icon: Search,
    title: "Deep Search & Filters",
    description:
      "Instantly search by title, amount, or category. Sort by newest, oldest, or highest amounts with zero lag.",
    color: "text-violet-500",
    bg: "bg-violet-50",
  },
  {
    icon: ShieldCheck,
    title: "Bank-Grade Clerk Security",
    description:
      "Secured by industry-standard Clerk authentication with auto-provisioning MongoDB integration and full data encryption.",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: Smartphone,
    title: "100% Mobile & Tablet Ready",
    description:
      "Smooth mobile drawer navigation and responsive layout engineered for smartphones, tablets, and wide monitors.",
    color: "text-rose-500",
    bg: "bg-rose-50",
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Features & Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to master your money.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Engineered with modern full-stack performance to give you instant clarity and complete control over your financial life.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center mb-5 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default memo(FeaturesGrid);

