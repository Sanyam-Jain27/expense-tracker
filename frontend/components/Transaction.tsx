"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  SquarePen,
  Trash2,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  Wallet,
  Calendar,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

import { Spinner } from "./ui/spinner";
import TransactionModel from "./Transaction.Model";
import { fetchAllTransactions } from "@/services/transaction.services";
import {
  addIncome,
  deleteIncome,
  updateIncome,
} from "@/services/income.services";
import {
  addExpense,
  deleteExpense,
  updateExpense,
} from "@/services/expense.services";
import {
  fetchTransactionsList,
  getChartOptions,
  formatCurrency,
  formatDate,
} from "@/utils/helpers";
import { IChartSeriesPoint, ITransactionData, ChartTypes } from "@/utils/types";

const Transaction = () => {
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<ITransactionData[]>(
    []
  );
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransactionData | null>(null);

  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartTypes>("column");

  // Search, Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">(
    "all"
  );
  const [sortBy, setSortBy] = useState<
    "date-desc" | "date-asc" | "amount-desc" | "amount-asc"
  >("date-desc");

  const { getToken } = useAuth();

  const handleFetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const transactions = await fetchAllTransactions(token);
      setTransactionList(transactions || []);

      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(
        transactions || []
      );
      setSeriesData(newSeriesData);
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    handleFetchTransactions();
  }, [handleFetchTransactions]);

  const handleAddTransaction = async (
    data: ITransactionData,
    type: "income" | "expense"
  ) => {
    try {
      const token = await getToken();
      if (!token) return;

      if (type === "income") {
        await addIncome(data, token);
      } else {
        await addExpense(data, token);
      }

      await handleFetchTransactions();
      toast.success(
        `${type === "income" ? "Income" : "Expense"} added successfully`
      );
    } catch (error) {
      console.error(error);
      toast.error("Error creating transaction");
    }
  };

  const handleUpdateTransaction = async (
    data: ITransactionData,
    type: "income" | "expense"
  ) => {
    try {
      const token = await getToken();
      if (!token || !data._id) return;

      if (type === "income") {
        await updateIncome(data, data._id, token);
      } else {
        await updateExpense(data, data._id, token);
      }

      await handleFetchTransactions();
      setIsEditMode(false);
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error updating transaction");
    }
  };

  const handleDeleteTransaction = async (id: string, type?: string) => {
    try {
      const token = await getToken();
      if (!token) return;

      if (type === "expense") {
        await deleteExpense(id, token);
      } else {
        await deleteIncome(id, token);
      }

      await handleFetchTransactions();
      toast.success("Transaction deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting transaction");
    }
  };

  // Summary Metrics
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    transactionList.forEach((t) => {
      const amt = Number(t.amount) || 0;
      if (t.transactionType === "income") totalIncome += amt;
      else totalExpense += amt;
    });
    return {
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    };
  }, [transactionList]);

  // Filtered & Sorted Transactions
  const filteredTransactions = useMemo(() => {
    return transactionList
      .filter((t) => {
        const matchesFilter =
          filterType === "all" || t.transactionType === filterType;
        const searchLower = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !searchLower ||
          (t.title && t.title.toLowerCase().includes(searchLower)) ||
          (t.category && t.category.toLowerCase().includes(searchLower));
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.createdAt || "").getTime();
        const dateB = new Date(b.date || b.createdAt || "").getTime();
        const amtA = Number(a.amount) || 0;
        const amtB = Number(b.amount) || 0;

        if (sortBy === "date-desc") return dateB - dateA;
        if (sortBy === "date-asc") return dateA - dateB;
        if (sortBy === "amount-desc") return amtB - amtA;
        if (sortBy === "amount-asc") return amtA - amtB;
        return 0;
      });
  }, [transactionList, filterType, searchTerm, sortBy]);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData, chartType);
  }, [categories, seriesData, chartType]);

  const handleToggleChartType = () => {
    setChartType((prev) => (prev === "column" ? "line" : "column"));
  };

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Transactions
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Manage, filter, and inspect your full transaction history
          </p>
        </div>

        <TransactionModel
          onAddTransaction={handleAddTransaction}
          onUpdateTransaction={handleUpdateTransaction}
          showModal={showModal}
          setShowModal={setShowModal}
          transactionObj={selectedTransaction}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
        />
      </div>

      {/* Quick Stats Banner */}
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
            {formatCurrency(metrics.netBalance)}
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
            +{formatCurrency(metrics.totalIncome)}
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
            -{formatCurrency(metrics.totalExpense)}
          </div>
        </div>
      </div>

      {/* Chart Section */}
      {transactionList.length > 0 && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Activity Timeline
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chronological visualization of incoming and outgoing funds
              </p>
            </div>
            <button
              className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={handleToggleChartType}
            >
              Switch to {chartType === "column" ? "Line View" : "Bar View"}
            </button>
          </div>
          <div className="mt-4">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      )}

      {/* Search, Filter & Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Tabs */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl">
              {(["all", "income", "expense"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all cursor-pointer ${
                    filterType === type
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {type === "all" ? "All Types" : type}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Amount: High to Low</option>
                <option value="amount-asc">Amount: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <Spinner className="w-8 h-8 text-indigo-600" />
            <span className="text-xs text-slate-400 font-medium">
              Updating list...
            </span>
          </div>
        ) : filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Transaction</th>
                  <th className="py-3.5 px-3">Type</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredTransactions.map((item) => {
                  const isIncome = item.transactionType === "income";
                  return (
                    <tr
                      key={item._id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0 group-hover:bg-white group-hover:shadow-xs transition-all">
                            {item.emoji || (isIncome ? "💰" : "💸")}
                          </span>
                          <span className="font-semibold text-slate-900 truncate max-w-[200px]">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isIncome
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {isIncome ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {isIncome ? "Income" : "Expense"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                          {item.category || "General"}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-xs text-slate-500 whitespace-nowrap font-medium">
                        {formatDate(item.date)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span
                          className={`font-bold text-sm ${
                            isIncome ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {isIncome ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedTransaction(item);
                              setIsEditMode(true);
                              setShowModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteTransaction(
                                item._id || "",
                                item.transactionType
                              )
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-56 flex flex-col items-center justify-center text-slate-400 gap-3 border border-dashed border-slate-200 rounded-xl">
            <span className="text-sm font-medium">
              {searchTerm || filterType !== "all"
                ? "No matching transactions found"
                : "No transactions recorded yet"}
            </span>
            <button
              onClick={() => {
                setSelectedTransaction(null);
                setIsEditMode(false);
                setShowModal(true);
              }}
              className="text-xs font-semibold px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Record First Transaction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transaction;
