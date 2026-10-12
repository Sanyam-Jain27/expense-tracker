"use client";

import React, { memo } from "react";
import { UserPlus, PlusCircle, LineChart } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Create Your Account",
    description:
      "Sign up in 30 seconds using Google or Email. No credit card required, instant access to all analytics.",
  },
  {
    step: "02",
    icon: PlusCircle,
    title: "Record Income & Expenses",
    description:
      "Log everyday transactions with intuitive categories, custom emojis, and automatic totals.",
  },
  {
    step: "03",
    icon: LineChart,
    title: "Watch Your Savings Grow",
    description:
      "Track your monthly cashflow health, monitor savings efficiency, and optimize your wealth with confidence.",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Workflow
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Effortless financial clarity in three steps
        </h2>
        <p className="text-slate-600 text-sm sm:text-base">
          Get started in seconds and enjoy an organized financial command center.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="relative bg-white border border-slate-200/80 rounded-2xl p-7 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-indigo-600/30 font-mono">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-slate-300 z-10" />
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default memo(HowItWorks);

