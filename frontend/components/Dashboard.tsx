"use client";

import { useUser } from "@clerk/nextjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";

import { Spinner } from "./ui/spinner";
import { fetchAllTransactions } from "@/services/transaction.services";
import {
  getMonthlyIncomeExpense,
  getMoneyFlowOptions,
  getPieChartOptions,
  getCategoryWiseValue,
} from "@/utils/helpers";
import { ITransactionData } from "@/utils/types";
import { USER_IMAGE } from "@/utils/constants";

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
      setTransactionList(transactions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
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
    () => incomeList.reduce((sum, t) => sum + Number(t.amount), 0),
    [incomeList]
  );
  const totalExpense = useMemo(
    () => expenseList.reduce((sum, t) => sum + Number(t.amount), 0),
    [expenseList]
  );
  const totalBalance = totalIncome - totalExpense;
  const totalTransaction = totalIncome + totalExpense;

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
    () => getCategoryWiseValue(transactionList),
    [transactionList]
  );
  const pieOptions = useMemo(
    () => getPieChartOptions(categoryWiseValue),
    [categoryWiseValue]
  );

  const expenseByCategory = useMemo(
    () => getCategoryWiseValue(expenseList),
    [expenseList]
  );
  const topExpenseCategory = useMemo(() => {
    if (expenseByCategory.length === 0) return null;
    return expenseByCategory.reduce(
      (max, c) => (c.y > max.y ? c : max),
      expenseByCategory[0]
    );
  }, [expenseByCategory]);

  const topExpensePercent =
    topExpenseCategory && totalExpense > 0
      ? (topExpenseCategory.y / totalExpense) * 100
      : 0;
  const savingsRate =
    totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome) * 100 : 0;
  const incomeSpentPercent =
    totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

  const recentTransactions = useMemo(() => {
    return [...transactionList]
      .sort(
        (a, b) =>
          new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
      )
      .slice(0, 3);
  }, [transactionList]);

  const summaryCards = [
    { title: "Total balance", value: totalBalance, icon: Wallet },
    { title: "Income", value: totalIncome, icon: TrendingUp },
    { title: "Expense", value: totalExpense, icon: TrendingDown },
    { title: "Total transaction", value: totalTransaction, icon: RefreshCcw },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <Spinner className="w-10 h-10" />
      </div>
    );
  }

  return (
    <div className="w-full px-8 py-6">
      {/* Welcome header — add this block above your Summary Cards */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <span className="text-2xl font-medium text-slate-900">
            Welcome back, {user?.fullName}
          </span>
          <span className="text-gray-500 text-sm mt-0.5">
            It is the best time to manage your finances
          </span>
        </div>

        <div className="flex items-center gap-3 border border-gray-200 rounded-full pl-2 pr-4 py-1.5">
          <img
            src={user?.imageUrl || USER_IMAGE}
            alt="user-img"
            className="h-9 w-9 rounded-full object-cover"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium text-slate-900">
              {user?.fullName}
            </span>
            <span className="text-xs text-gray-500">
              {user?.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <div
            key={card.title}
            className="border border-gray-300 rounded-3xl bg-white p-5"
          >
            <card.icon className="w-6 h-6 text-slate-700 mb-3" />
            <div className="text-sm text-slate-500 mb-1">{card.title}</div>
            <div className="text-2xl font-semibold text-black">
              ${card.value}
            </div>
          </div>
        ))}
      </div>

      {/* Money Flow + Category Breakdown */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
        <div className="border border-gray-300 py-3 px-6 rounded-3xl bg-white">
          <div className="font-medium text-lg mb-2 text-slate-900">
            Money flow
          </div>
          {moneyFlowOptions ? (
            <HighchartsReact
              highcharts={Highcharts}
              options={moneyFlowOptions}
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No transaction data yet
            </div>
          )}
        </div>

        <div className="border border-gray-300 py-3 px-6 rounded-3xl bg-white">
          <div className="font-medium text-lg mb-2 text-slate-900">
            Category breakdown
          </div>
          {categoryWiseValue.length > 0 ? (
            <HighchartsReact highcharts={Highcharts} options={pieOptions} />
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
              No category data yet
            </div>
          )}
        </div>
      </div>

      {/* Recent Transactions + Financial Summary */}
      <div className="grid grid-cols-[2fr_1fr] gap-4 mt-4">
        <div className="border border-gray-300 py-3 px-6 rounded-3xl bg-white">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium text-lg text-slate-900">
              Recent transactions
            </div>
            <Link
              href="/transaction"
              className="text-sm font-medium text-slate-600 hover:text-black flex items-center gap-1"
            >
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {recentTransactions.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-sm font-semibold text-slate-600">
                  <th className="py-2 px-2">Icon</th>
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Amount</th>
                  <th className="py-2 px-2">Title</th>
                  <th className="py-2 px-2">Type</th>
                  <th className="py-2 px-2">Category</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {recentTransactions.map((item) => (
                  <tr key={item._id}>
                    <td className="py-3 px-2">
                      <span className="text-xl flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        {item.emoji || "💵"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className="py-3 px-2 text-slate-500">{item.amount}</td>
                    <td className="py-3 px-2 font-medium text-slate-900">
                      {item.title}
                    </td>
                    <td className="py-3 px-2 text-slate-500 capitalize">
                      {item.transactionType}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {item.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="h-32 flex items-center justify-center text-slate-400 text-sm">
              No transactions yet
            </div>
          )}
        </div>

        <div className="border border-gray-300 py-3 px-6 rounded-3xl bg-white">
          <div className="font-medium text-lg mb-4 text-slate-900">
            Financial Summary
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-600 mb-1">
                {topExpenseCategory ? topExpenseCategory.name : "Top category"}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(topExpensePercent, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-14 text-right">
                  {topExpensePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-1">Savings Rate</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{
                      width: `${Math.min(Math.max(savingsRate, 0), 100)}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-14 text-right">
                  {savingsRate.toFixed(2)}%
                </span>
              </div>
            </div>

            <div>
              <div className="text-sm text-slate-600 mb-1">Income Spent</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full"
                    style={{ width: `${Math.min(incomeSpentPercent, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-slate-700 w-14 text-right">
                  {incomeSpentPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
