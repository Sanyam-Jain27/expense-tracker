"use client";

import React, { memo } from "react";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string | null;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userName }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          Welcome back, {userName || "there"} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          {currentDate}
        </p>
      </div>

      <div className="flex items-center gap-2 self-start md:self-auto">
        <Link
          href="/transaction"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all active:scale-[0.98]"
        >
          New Transaction
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default memo(DashboardHeader);

