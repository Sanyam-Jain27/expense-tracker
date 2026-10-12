"use client";

import React, { memo } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Lock,
  Sparkles,
} from "lucide-react";

const DashboardPreview: React.FC = () => {
  return (
    <section id="preview" className="relative pb-24 max-w-6xl mx-auto px-6">
      {/* Outer Shell with Glassmorphism and Glow */}
      <div className="relative rounded-3xl bg-slate-900/5 p-2 sm:p-4 border border-slate-200/80 shadow-2xl">
        {/* Mock Top App Bar */}
        <div className="bg-slate-950 rounded-2xl p-4 sm:p-6 text-white space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">
                app.fintrack.finance/dashboard
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Preview</span>
            </div>
          </div>

          {/* Mock KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                <span>TOTAL BALANCE</span>
                <Wallet className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white mt-2">$24,850.00</div>
              <div className="text-[11px] text-emerald-400 font-medium mt-1">
                +14.2% from last month
              </div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                <span>TOTAL INFLOW</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 mt-2">+$8,400.00</div>
              <div className="text-[11px] text-slate-400 mt-1">Salary & Freelance</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                <span>TOTAL OUTFLOW</span>
                <TrendingDown className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-rose-400 mt-2">-$3,120.00</div>
              <div className="text-[11px] text-slate-400 mt-1">Within budget goals</div>
            </div>

            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <div className="flex justify-between items-center text-slate-400 text-xs font-semibold">
                <span>SAVINGS RATE</span>
                <PieChart className="w-4 h-4 text-violet-400" />
              </div>
              <div className="text-2xl font-bold text-violet-300 mt-2">62.8%</div>
              <div className="text-[11px] text-emerald-400 mt-1">Exceptional health</div>
            </div>
          </div>

          {/* Mock Visual Cash Flow + Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Cash Flow Bars */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-white">Monthly Cashflow Dynamics</span>
                <div className="flex gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Income
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Expense
                  </span>
                </div>
              </div>

              {/* Mock Bar Chart Columns */}
              <div className="h-44 flex items-end justify-between gap-3 pt-4 border-b border-slate-800">
                {[
                  { month: "Jun", inc: 65, exp: 35 },
                  { month: "Jul", inc: 72, exp: 40 },
                  { month: "Aug", inc: 80, exp: 32 },
                  { month: "Sep", inc: 85, exp: 38 },
                  { month: "Oct", inc: 92, exp: 34 },
                ].map((item) => (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex items-end justify-center gap-1.5 h-36">
                      <div
                        className="w-1/2 bg-emerald-500 rounded-t-md transition-all hover:opacity-90"
                        style={{ height: `${item.inc}%` }}
                      />
                      <div
                        className="w-1/2 bg-rose-500 rounded-t-md transition-all hover:opacity-90"
                        style={{ height: `${item.exp}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-medium">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Mock Transactions List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <span className="text-sm font-bold text-white block">Recent Activity</span>

              <div className="space-y-2.5">
                {[
                  { icon: "💼", title: "Software Salary", cat: "Salary", amt: "+$6,500.00", isInc: true },
                  { icon: "💻", title: "Client Consulting", cat: "Freelance", amt: "+$1,900.00", isInc: true },
                  { icon: "🛒", title: "Supermarket Goods", cat: "Groceries", amt: "-$184.50", isInc: false },
                  { icon: "⚡", title: "Cloud Hosting", cat: "Utilities", amt: "-$49.00", isInc: false },
                ].map((t) => (
                  <div
                    key={t.title}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 border border-slate-800/60"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{t.icon}</span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{t.title}</div>
                        <div className="text-[10px] text-slate-400">{t.cat}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        t.isInc ? "text-emerald-400" : "text-rose-400"
                      }`}
                    >
                      {t.amt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Lock Callout Banner */}
          <div className="bg-gradient-to-r from-indigo-900/40 via-violet-900/30 to-indigo-900/40 border border-indigo-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">
                  Want to record your own income and expenses?
                </h4>
                <p className="text-xs text-slate-300">
                  Create a secure FinTrack account or sign in to access your personal dashboard.
                </p>
              </div>
            </div>

            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-900 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Sign Up to Start Tracking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(DashboardPreview);
