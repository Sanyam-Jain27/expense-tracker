"use client";
import { toast } from "sonner";
import ExpenseModel from "./ExpenseModel";
import { TrendingDown, SquarePen, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  addExpense,
  deleteExpense,
  fetchExpense,
  updateExpense,
} from "@/services/expense.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";

const Expense = () => {
  const [loading, setloading] = useState(false);
  const [expenseList, setexpenseList] = useState<ITransactionData[]>([]);
  const [showExpenseModal, setshowExpenseModal] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [expenseObj, setexpenseObj] = useState<ITransactionData | null>(null);
  const [seriesData, setseriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setcategories] = useState<string[]>([]);
  const { getToken } = useAuth();

  const handleAddExpense = async (expenseObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      await addExpense(expenseObj, token);
      await handleFetchUserExpense();
      toast.success("Expense added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while adding expense");
    }
  };

  const handleFetchUserExpense = async () => {
    try {
      setloading(true);
      const token = await getToken();
      if (!token) return;
      const expenseList = await fetchExpense(token);
      setexpenseList(expenseList);
      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(expenseList);
      setseriesData(newSeriesData);
      setcategories(newCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleUpdateExpense = async (expense: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !expense._id) return;
      await updateExpense(expense, expense._id, token);
      await handleFetchUserExpense();
      setisEditMode(false);
      toast.success("Expense updated successfully");
    } catch (error) {
      toast.error("Error updating expense");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteExpense(id, token);
      await handleFetchUserExpense();
      toast.success("Expense deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting");
    }
  };

  useEffect(() => {
    handleFetchUserExpense();
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-full px-8 py-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-medium text-black">Expenses</h1>
        <ExpenseModel
          onAddExpense={handleAddExpense}
          onUpdateExpense={handleUpdateExpense}
          showExpenseModal={showExpenseModal}
          setshowExpenseModal={setshowExpenseModal}
          expenseObj={expenseObj}
          isEditMode={isEditMode}
          setIsEditMode={setisEditMode}
        />
      </div>

      {expenseList.length > 0 && (
        <div className="border border-gray-300 mt-4 py-3 px-6 rounded-3xl bg-white">
          <div className="font-medium text-lg mb-4 text-slate-900">Expense Overview</div>
          <div className="text-sm text-gray-500">
            Monitor your expenses over time and gain insights into your spending.
          </div>
          <div className="mt-6">
            <HighchartsReact highcharts={Highcharts} options={options} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64 w-full">
          <Spinner className="w-10 h-10" />
        </div>
      ) : expenseList.length > 0 ? (
        <div className="mt-6 w-full border border-slate-200 rounded-3xl bg-white px-6 py-5 shadow-xs">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {expenseList.map((expense: ITransactionData, index: number) => (
              <div className="flex items-center justify-between gap-4 min-w-0" key={index}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-gray-100 shadow-sm text-2xl w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    {expense.emoji}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-slate-900 leading-tight truncate">
                      {expense.title}
                    </span>
                    <span className="text-gray-500 text-sm leading-tight truncate">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium leading-tight">
                      {expense.date ? new Date(expense.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-rose-100 rounded-md px-4 py-1.5">
                    <span className="text-rose-800 font-medium whitespace-nowrap">
                      - ${expense.amount}
                    </span>
                    <TrendingDown className="w-4 h-4 text-rose-800" />
                  </div>

                  <div className="flex items-center gap-2">
                    <SquarePen
                      className="w-5 h-5 text-gray-500 cursor-pointer hover:text-slate-800 transition-colors"
                      onClick={() => {
                        setisEditMode(true);
                        setshowExpenseModal(true);
                        setexpenseObj(expense);
                      }}
                    />
                    <Trash2
                      className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteExpense(expense._id || "")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center font-medium text-slate-500">
          Click the &quot;Add Expense&quot; button to add expense
        </div>
      )}
    </div>
  );
};

export default Expense;