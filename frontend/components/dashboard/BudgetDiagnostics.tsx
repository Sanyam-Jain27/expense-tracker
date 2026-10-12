"use client";

import React, { memo } from "react";

interface BudgetDiagnosticsProps {
  topExpenseName?: string;
  topExpensePercent: number;
  savingsRate: number;
  incomeSpentPercent: number;
}

const BudgetDiagnostics: React.FC<BudgetDiagnosticsProps> = ({
  topExpenseName,
  topExpensePercent,
  savingsRate,
  incomeSpentPercent,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div>
        <h2 className="text-base font-bold text-slate-900">
          Budget Health & Analytics
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Key performance indicators for your wealth
        </p>
      </div>

      <div className="space-y-5 my-auto py-4">
        {/* Top Category */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Top Expense ({topExpenseName || "N/A"})</span>
            <span className="text-slate-900 font-bold">
              {topExpensePercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(topExpensePercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Savings Rate */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Savings Efficiency</span>
            <span className="text-slate-900 font-bold">
              {savingsRate.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                savingsRate >= 20 ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${Math.min(savingsRate, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {savingsRate >= 20
              ? "Great! Above the 20% healthy threshold."
              : "Target saving 20% or more of income."}
          </p>
        </div>

        {/* Income Spent */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
            <span>Income Consumed</span>
            <span className="text-slate-900 font-bold">
              {incomeSpentPercent.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                incomeSpentPercent > 80 ? "bg-rose-500" : "bg-indigo-500"
              }`}
              style={{ width: `${Math.min(incomeSpentPercent, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
        Analytics update in real-time as transactions are recorded.
      </div>
    </div>
  );
};

export default memo(BudgetDiagnostics);

