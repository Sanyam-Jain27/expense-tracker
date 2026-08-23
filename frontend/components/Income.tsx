"use client";
import { toast } from "sonner";
import IncomeModel from "./IncomeModel";
import { TrendingUp, SquarePen, Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  addIncome,
  deleteIncome,
  fetchIncome,
  updateIncome,
} from "@/services/income.services";
import { IChartSeriesPoint, ITransactionData } from "@/utils/types";
import { useEffect, useMemo, useState } from "react";
import { Spinner } from "./ui/spinner";
import { fetchTransactionsList, getChartOptions } from "@/utils/helpers";

const Income = () => {
  const [loading, setloading] = useState(false);
  const [incomeList, setincomeList] = useState<ITransactionData[]>([]);
  const [showIncomeModal, setshowIncomeModal] = useState(false);
  const [isEditMode, setisEditMode] = useState(false);
  const [incomeObj, setincomeObj] = useState<ITransactionData | null>(null);
  const [seriesData, setseriesData] = useState<IChartSeriesPoint[]>([]);
  const [categories, setcategories] = useState<string[]>([]);
  const { getToken } = useAuth();

  const handleAddIncome = async (incomeObj: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token) return;
      await addIncome(incomeObj, token);
      await handleFetchUserIncome();
      toast.success("Income added successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while adding income");
    }
  };

  const handleFetchUserIncome = async () => {
    try {
      setloading(true);
      const token = await getToken();
      if (!token) return;
      const incomeList = await fetchIncome(token);
      setincomeList(incomeList);
      const { newSeriesData = [], newCategories = [] } = fetchTransactionsList(incomeList);
      setseriesData(newSeriesData);
      setcategories(newCategories);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  const handleUpdateIncome = async (income: ITransactionData) => {
    try {
      const token = await getToken();
      if (!token || !income._id) return;
      await updateIncome(income, income._id, token);
      await handleFetchUserIncome();
      setisEditMode(false);
      toast.success("Income updated successfully");
    } catch (error) {
      toast.error("Error updating income");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) return;
      await deleteIncome(id, token);
      await handleFetchUserIncome();
      toast.success("Income deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("Error while deleting");
    }
  };

  useEffect(() => {
    handleFetchUserIncome();
  }, []);

  const options: Highcharts.Options = useMemo(() => {
    return getChartOptions(categories, seriesData);
  }, [categories, seriesData]);

  return (
    <div className="w-full px-8 py-6">
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-medium text-black">Incomes</h1>
        <IncomeModel
          onAddIncome={handleAddIncome}
          onUpdateIncome={handleUpdateIncome}
          showIncomeModal={showIncomeModal}
          setshowIncomeModal={setshowIncomeModal}
          incomeObj={incomeObj}
          isEditMode={isEditMode}
          setIsEditMode={setisEditMode}
        />
      </div>

      {incomeList.length > 0 && (
        <div className="border border-gray-300 mt-4 py-3 px-6 rounded-3xl bg-white">
        <div className="font-medium text-lg mb-4 text-slate-900">Income Overview</div>
          <div className="text-sm text-gray-500">
            Monitor your income over time and gain insights into your earnings.
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
      ) : incomeList.length > 0 ? (
        <div className="mt-6 w-full border border-slate-200 rounded-3xl bg-white px-6 py-5 shadow-xs">
          <div className="grid grid-cols-2 gap-x-10 gap-y-6">
            {incomeList.map((income: ITransactionData, index: number) => (
              <div className="flex items-center justify-between gap-4 min-w-0" key={index}>
                <div className="flex items-center gap-3 min-w-0">
                  <span className="bg-gray-100 shadow-sm text-2xl w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    {income.emoji}
                  </span>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="font-medium text-slate-900 leading-tight truncate">
                      {income.title}
                    </span>
                    <span className="text-gray-500 text-sm leading-tight truncate">
                      {income.category}
                    </span>
                    <span className="text-xs text-gray-400 font-medium leading-tight">
                      {income.date ? new Date(income.date).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-2 bg-green-100 rounded-md px-4 py-1.5">
                    <span className="text-green-800 font-medium whitespace-nowrap">
                      + ${income.amount}
                    </span>
                    <TrendingUp className="w-4 h-4 text-green-800" />
                  </div>

                  <div className="flex items-center gap-2">
                    <SquarePen
                      className="w-5 h-5 text-gray-500 cursor-pointer hover:text-slate-800 transition-colors"
                      onClick={() => {
                        setisEditMode(true);
                        setshowIncomeModal(true);
                        setincomeObj(income);
                      }}
                    />
                    <Trash2
                      className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => handleDeleteIncome(income._id || "")}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="w-full h-48 flex items-center justify-center font-medium text-slate-500">
          Click the &quot;Add Income&quot; button to add income
        </div>
      )}
    </div>
  );
};

export default Income;