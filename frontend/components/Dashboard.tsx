"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Highcharts from "highcharts";

import { Spinner } from "./ui/spinner";
import { fetchAllTransactions } from "@/services/transaction.services";
import {
  getMonthlyIncomeExpense,
  getMoneyFlowOptions,
  getPieChartOptions,
  getCategoryWiseValue,
} from "@/utils/helpers";
import { ITransactionData } from "@/utils/types";

import DashboardHeader from "./dashboard/DashboardHeader";
import DashboardMetrics from "./dashboard/DashboardMetrics";
import CashFlowChart from "./dashboard/CashFlowChart";
import CategoryChart from "./dashboard/CategoryChart";
import RecentTransactions from "./dashboard/RecentTransactions";
import BudgetDiagnostics from "./dashboard/BudgetDiagnostics";

const Dashboard = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<ITransactionData[]>([]);
  const [moneyFlowOptions, setMoneyFlowOptions] = useState<Highcharts.Options | null>(null);

  const handleFetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const transactions = await fetchAllTransactions(token);
      setTransactionList(transactions || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    handleFetchTransactions();
  }, [handleFetchTransactions]);

  const incomeList = useMemo(
    () => transactionList.filter((t) => t.transactionType === "income"),
    [transactionList]
  );
  const expenseList = useMemo(
    () => transactionList.filter((t) => t.transactionType === "expense"),
    [transactionList]
  );

  const totalIncome = useMemo(
    () => incomeList.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [incomeList]
  );
  const totalExpense = useMemo(
    () => expenseList.reduce((sum, t) => sum + (Number(t.amount) || 0), 0),
    [expenseList]
  );
  const totalBalance = totalIncome - totalExpense;

  const savingsRate =
    totalIncome > 0 ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100) : 0;
  const incomeSpentPercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  useEffect(() => {
    const buildMoneyFlow = async () => {
      if (incomeList.length === 0 && expenseList.length === 0) {
        setMoneyFlowOptions(null);
        return;
      }
      const { incomeSeries, expenseSeries, categories } =
        await getMonthlyIncomeExpense(incomeList, expenseList);
      setMoneyFlowOptions(
        getMoneyFlowOptions(categories, incomeSeries, expenseSeries)
      );
    };
    buildMoneyFlow();
  }, [incomeList, expenseList]);

  const categoryWiseValue = useMemo(
    () => getCategoryWiseValue(expenseList.length > 0 ? expenseList : transactionList),
    [expenseList, transactionList]
  );

  const pieOptions = useMemo(
    () => getPieChartOptions(categoryWiseValue),
    [categoryWiseValue]
  );

  const topExpenseCategory = useMemo(() => {
    if (categoryWiseValue.length === 0) return null;
    return categoryWiseValue[0];
  }, [categoryWiseValue]);

  const topExpensePercent =
    topExpenseCategory && totalExpense > 0
      ? (topExpenseCategory.y / totalExpense) * 100
      : 0;

  const recentTransactions = useMemo(() => {
    return [...transactionList]
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || "").getTime();
        const dateB = new Date(b.date || b.createdAt || "").getTime();
        return dateB - dateA;
      })
      .slice(0, 5);
  }, [transactionList]);

  if (loading && transactionList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] w-full gap-3">
        <Spinner className="w-10 h-10 text-indigo-600" />
        <span className="text-sm font-medium text-slate-500">
          Loading analytics...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* 1. Header */}
      <DashboardHeader userName={user?.firstName || user?.fullName} />

      {/* 2. Executive KPI Metrics */}
      <DashboardMetrics
        totalBalance={totalBalance}
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        incomeCount={incomeList.length}
        expenseCount={expenseList.length}
        savingsRate={savingsRate}
        incomeSpentPercent={incomeSpentPercent}
      />

      {/* 3. Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CashFlowChart options={moneyFlowOptions} />
        <CategoryChart options={pieOptions} hasData={categoryWiseValue.length > 0} />
      </div>

      {/* 4. Bottom Activity & Health Diagnostics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentTransactions
          transactions={recentTransactions}
          totalCount={transactionList.length}
        />
        <BudgetDiagnostics
          topExpenseName={topExpenseCategory?.name}
          topExpensePercent={topExpensePercent}
          savingsRate={savingsRate}
          incomeSpentPercent={incomeSpentPercent}
        />
      </div>
    </div>
  );
};

export default Dashboard;
