"use client";

import React, { memo } from "react";
import { Wallet, TrendingUp, TrendingDown, PieChart as PieIcon } from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import { formatCurrency } from "@/utils/helpers";

interface DashboardMetricsProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
  incomeCount: number;
  expenseCount: number;
  savingsRate: number;
  incomeSpentPercent: number;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  totalBalance,
  totalIncome,
  totalExpense,
  incomeCount,
  expenseCount,
  savingsRate,
  incomeSpentPercent,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <StatCard
        title="Total Balance"
        value={formatCurrency(totalBalance)}
        subtext={totalBalance >= 0 ? "Healthy cashflow" : "Deficit warning"}
        icon={Wallet}
        color="text-indigo-600"
        bg="bg-indigo-50"
      />

      <StatCard
        title="Total Inflow"
        value={formatCurrency(totalIncome)}
        subtext={`${incomeCount} income records`}
        icon={TrendingUp}
        color="text-emerald-600"
        bg="bg-emerald-50"
      />

      <StatCard
        title="Total Outflow"
        value={formatCurrency(totalExpense)}
        subtext={`${expenseCount} expense records`}
        icon={TrendingDown}
        color="text-rose-600"
        bg="bg-rose-50"
      />

      <StatCard
        title="Savings Rate"
        value={`${savingsRate.toFixed(1)}%`}
        subtext={`${incomeSpentPercent.toFixed(1)}% of income spent`}
        icon={PieIcon}
        color="text-violet-600"
        bg="bg-violet-50"
      />
    </div>
  );
};

export default memo(DashboardMetrics);

