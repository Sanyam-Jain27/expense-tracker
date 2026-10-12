"use client";

import React, { memo } from "react";
import Link from "next/link";
import { CircleDollarSign, ArrowRight, LayoutDashboard } from "lucide-react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <CircleDollarSign className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              FinTrack
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide">
              Expense Analytics
            </span>
          </div>
        </Link>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-indigo-600 transition-colors">
            Live Preview
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="hover:text-indigo-600 transition-colors">
            Reviews
          </a>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-indigo-500/20 transition-all active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </SignedOut>

          <SignedIn>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl shadow-sm transition-all active:scale-95"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Open Dashboard</span>
            </Link>
            <div className="pl-1">
              <UserButton />
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default memo(Navbar);
