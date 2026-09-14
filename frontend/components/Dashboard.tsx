"use client";

import { useUser, useAuth } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PieChart as PieIcon,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";

import { Spinner } from "./ui/spinner";
import { fetchAllTransactions } from "@/services/transaction.services";
import {
  getMonthlyIncomeExpense,
  getMoneyFlowOptions,
  getPieChartOptions,
  getCategoryWiseValue,
  formatCurrency,
  formatDate,
} from "@/utils/helpers";
import { ITransactionData } from "@/utils/types";

const Dashboard = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<ITransactionData[]>(
    []
  );
  const { getToken } = useAuth();

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
    totalIncome > 0
      ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100)
      : 0;
  const incomeSpentPercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const [moneyFlowOptions, setMoneyFlowOptions] =
    useState<Highcharts.Options | null>(null);

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
    () =>
      getCategoryWiseValue(
        expenseList.length > 0 ? expenseList : transactionList
      ),
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

  const summaryCards = [
    {
      title: "Total Balance",
      value: formatCurrency(totalBalance),
      subtext: totalBalance >= 0 ? "Healthy cashflow" : "Deficit warning",
      icon: Wallet,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-100",
    },
    {
      title: "Total Inflow",
      value: formatCurrency(totalIncome),
      subtext: `${incomeList.length} income transactions`,
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100",
    },
    {
      title: "Total Outflow",
      value: formatCurrency(totalExpense),
      subtext: `${expenseList.length} expense transactions`,
      icon: TrendingDown,
      color: "text-rose-600",
      bg: "bg-rose-50",
      border: "border-rose-100",
    },
    {
      title: "Savings Rate",
      value: `${savingsRate.toFixed(1)}%`,
      subtext: `${incomeSpentPercent.toFixed(1)}% of income spent`,
      icon: PieIcon,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-100",
    },
  ];

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

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Welcome back, {user?.firstName || user?.fullName || "there"} 👋
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {card.value}
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  {card.subtext}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Row: Money Flow + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Money Flow Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Monthly Cash Flow
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Income vs Expenses comparison across months
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Inflow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                Outflow
              </span>
            </div>
          </div>

          {moneyFlowOptions ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={moneyFlowOptions}
            />
          ) : (
            <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
              <TrendingUp className="w-8 h-8 text-slate-300" />
              <span className="text-sm font-medium">
                No cash flow records yet
              </span>
            </div>
          )}
        </div>

        {/* Category Breakdown Donut */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Spending by Category
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Breakdown of expenses by category
            </p>
          </div>

          <div className="my-auto">
            {categoryWiseValue.length > 0 ? (
              <HighchartsReact highcharts={Highcharts} options={pieOptions} />
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-slate-400 gap-2">
                <PieIcon className="w-8 h-8 text-slate-300" />
                <span className="text-sm font-medium">
                  No category records yet
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Activity + Financial Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Recent Transactions
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest recorded financial activities
              </p>
            </div>
            <Link
              href="/transaction"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
            >
              View All ({transactionList.length})
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    <th className="pb-3 px-3">Item</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Date</th>
                    <th className="pb-3 px-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {recentTransactions.map((item) => {
                    const isIncome = item.transactionType === "income";
                    return (
                      <tr
                        key={item._id || `${item.title}-${item.date}`}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                              {item.emoji || (isIncome ? "💰" : "💸")}
                            </span>
                            <span className="font-semibold text-slate-900 truncate max-w-[180px]">
                              {item.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                            {item.category || "General"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
                          {formatDate(item.date)}
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-sm ${
                              isIncome ? "text-emerald-600" : "text-rose-600"
                            }`}
                          >
                            {isIncome ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                            {isIncome ? "+" : "-"}
                            {formatCurrency(item.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-slate-400 gap-3">
              <span className="text-sm font-medium">No transactions found</span>
              <Link
                href="/transaction"
                className="text-xs font-semibold px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Add Your First Transaction
              </Link>
            </div>
          )}
        </div>

        {/* Financial Diagnostics Card */}
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
                <span>Top Expense ({topExpenseCategory?.name || "N/A"})</span>
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
      </div>
    </div>
  );
};

export default Dashboard;
