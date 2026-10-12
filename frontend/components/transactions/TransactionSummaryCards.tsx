"use client";

import React, { memo } from "react";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/utils/helpers";

interface TransactionSummaryCardsProps {
  netBalance: number;
  totalIncome: number;
  totalExpense: number;
}

const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({
  netBalance,
  totalIncome,
  totalExpense,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Net Balance
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-slate-900 mt-2">
          {formatCurrency(netBalance)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Inflow
          </span>
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-emerald-600 mt-2">
          +{formatCurrency(totalIncome)}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Outflow
          </span>
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <TrendingDown className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold text-rose-600 mt-2">
          -{formatCurrency(totalExpense)}
        </div>
      </div>
    </div>
  );
};

export default memo(TransactionSummaryCards);

