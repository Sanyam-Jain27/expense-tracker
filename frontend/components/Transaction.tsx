"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { SquarePen, Trash2, TrendingUp, TrendingDown } from "lucide-react";
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
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";
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

  const { getToken } = useAuth();

  const handleFetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      const transactions = await fetchAllTransactions(token);
      setTransactionList(transactions);

      const { newSeriesData = [], newCategories = [] } =
        fetchTransactionsList(transactions);
      setSeriesData(newSeriesData);
      setCategories(newCategories);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch transactions");
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

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData, chartType);
  }, [categories, seriesData, chartType]);

  const handleToggleChartType = () => {
    setChartType((prev) => (prev === "column" ? "line" : "column"));
  };

  return (
    <div className="w-full px-8 py-6">
      {/* Top Header Section */}
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-medium text-black">Transactions</h1>
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

      {/* Highcharts Overview Section */}
      {transactionList.length > 0 && (
        <div className="border border-gray-300 mt-4 py-3 px-6 rounded-3xl bg-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-lg mb-4 text-slate-900">
                Transaction Overview
              </div>

              <div className="text-sm text-gray-500">
                Monitor your transactions over time and gain insights into your
                income and expenses.
              </div>
            </div>
            <button
              className="bg-black text-white text-xs px-3 py-1.5 rounded-md font-medium cursor-pointer"
              onClick={handleToggleChartType}
            >
              {chartType === "column" ? "Bar" : "Line"}
            </button>
          </div>
          <div className="mt-6">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      )}

      {/* Table Section */}
      {loading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <Spinner className="w-10 h-10" />
        </div>
      ) : transactionList.length > 0 ? (
        <div className="mt-6 w-full border border-slate-200 rounded-3xl bg-white px-6 py-5 overflow-x-auto shadow-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-sm font-semibold text-slate-600">
                <th className="py-3 px-2">Icon</th>
                <th className="py-3 px-2">Title</th>
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2 text-center">Edit</th>
                <th className="py-3 px-2 text-center">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {transactionList.map((item: ITransactionData) => {
                const isIncome = item.transactionType === "income";
                return (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <span className="text-xl flex items-center justify-center w-8 h-8 rounded-full bg-slate-100">
                        {item.emoji || "💵"}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-900">
                      {item.title}
                    </td>
                    <td className="py-3 px-2 text-slate-500 capitalize">
                      {item.transactionType || "Income"}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {item.category}
                    </td>
                    <td className="py-3 px-2 text-slate-500">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`inline-flex items-center gap-1 font-medium px-2.5 py-1 rounded-md text-xs ${
                          isIncome
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-rose-600 bg-rose-50"
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="w-3.5 h-3.5" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5" />
                        )}
                        {isIncome ? `+ $${item.amount}` : `- $${item.amount}`}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <SquarePen
                        className="w-4 h-4 mx-auto text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTransaction(item);
                          setIsEditMode(true);
                          setShowModal(true);
                        }}
                      />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Trash2
                        className="w-4 h-4 mx-auto text-rose-400 hover:text-rose-600 cursor-pointer transition-colors"
                        onClick={() =>
                          handleDeleteTransaction(
                            item._id || "",
                            item.transactionType
                          )
                        }
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center font-medium text-slate-500">
          Click the &quot;Add Transaction&quot; button to add a transaction.
        </div>
      )}
    </div>
  );
};

export default Transaction;
