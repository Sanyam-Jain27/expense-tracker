"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";

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
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";
import { IChartSeriesPoint, ITransactionData, ChartTypes } from "@/utils/types";

import TransactionSummaryCards from "./transactions/TransactionSummaryCards";
import TransactionTimelineChart from "./transactions/TransactionTimelineChart";
import TransactionFilters from "./transactions/TransactionFilters";
import TransactionTable from "./transactions/TransactionTable";

const Transaction = () => {
  const [loading, setLoading] = useState(false);
  const [transactionList, setTransactionList] = useState<ITransactionData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransactionData | null>(null);

  const [seriesData, setSeriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [chartType, setChartType] = useState<ChartTypes>("column");

  // Search, Filter & Sort state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  const { getToken } = useAuth();

  const handleFetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const transactions = await fetchAllTransactions(token);
      setTransactionList(transactions || []);

      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(transactions || []);
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

  const handleAddTransaction = async (data: ITransactionData, type: "income" | "expense") => {
    try {
      const token = await getToken();
      if (!token) return;

      if (type === "income") {
        await addIncome(data, token);
      } else {
        await addExpense(data, token);
      }

      await handleFetchTransactions();
      toast.success(`${type === "income" ? "Income" : "Expense"} added successfully`);
    } catch (error) {
      console.error(error);
      toast.error("Error creating transaction");
    }
  };

  const handleUpdateTransaction = async (data: ITransactionData, type: "income" | "expense") => {
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

  const filteredTransactions = useMemo(() => {
    return transactionList
      .filter((t) => {
        const matchesFilter = filterType === "all" || t.transactionType === filterType;
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

  const handleEditClick = (item: ITransactionData) => {
    setSelectedTransaction(item);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleAddNewClick = () => {
    setSelectedTransaction(null);
    setIsEditMode(false);
    setShowModal(true);
  };

  return (
    <div className="w-full px-6 py-8 md:px-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
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

      {/* Summary Cards */}
      <TransactionSummaryCards
        netBalance={metrics.netBalance}
        totalIncome={metrics.totalIncome}
        totalExpense={metrics.totalExpense}
      />

      {/* Activity Timeline Chart */}
      {transactionList.length > 0 && (
        <TransactionTimelineChart
          options={options}
          chartType={chartType}
          onToggleChartType={handleToggleChartType}
        />
      )}

      {/* Filterable Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
        <TransactionFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <Spinner className="w-8 h-8 text-indigo-600" />
            <span className="text-xs text-slate-400 font-medium">Updating list...</span>
          </div>
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            onEdit={handleEditClick}
            onDelete={handleDeleteTransaction}
            onAddNew={handleAddNewClick}
            hasFilters={Boolean(searchTerm || filterType !== "all")}
          />
        )}
      </div>
    </div>
  );
};

export default Transaction;
