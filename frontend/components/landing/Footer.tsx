"use client";

import React, { memo } from "react";
import Link from "next/link";
import { CircleDollarSign } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900 py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <CircleDollarSign className="w-5 h-5" />
          </div>
          <span className="text-base font-bold text-white tracking-tight">
            FinTrack
          </span>
          <span className="text-xs text-slate-500 pl-2 border-l border-slate-800">
            Personal Expense & Cashflow Platform
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold">
          <Link href="/login" className="hover:text-white transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="hover:text-white transition-colors">
            Create Account
          </Link>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-white transition-colors">
            Preview
          </a>
        </div>

        <div className="text-xs text-slate-500">
          © {new Date().getFullYear()} FinTrack. Built with Next.js, Clerk & MongoDB.
        </div>
      </div>
    </footer>
  );
};

export default memo(Footer);

