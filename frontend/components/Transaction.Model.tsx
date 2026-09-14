"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/model";
import EmojiPicker from "emoji-picker-react";
import { IEmojiObject } from "@/lib/types";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  INCOME_CATEGORY_CONSTANTS,
  EXPENSE_CATEGORY_CONSTANTS,
} from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { ITransactionData } from "@/utils/types";
import { toast } from "sonner";
import { formatDate } from "@/utils/helpers";

interface TransactionModelProps {
  onAddTransaction: (
    data: ITransactionData,
    type: "income" | "expense"
  ) => void;
  onUpdateTransaction: (
    data: ITransactionData,
    type: "income" | "expense"
  ) => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  transactionObj: ITransactionData | null;
  isEditMode: boolean;
  setIsEditMode: (value: boolean) => void;
}

const TransactionModel = ({
  onAddTransaction,
  onUpdateTransaction,
  showModal,
  setShowModal,
  transactionObj,
  isEditMode,
  setIsEditMode,
}: TransactionModelProps) => {
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "income"
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState("💵");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [openCalendar, setOpenCalendar] = useState(false);

  useEffect(() => {
    if (transactionObj && isEditMode) {
      setTitle(transactionObj.title || "");
      setCategory(transactionObj.category || "");
      setSelectEmoji(transactionObj.emoji || "💵");
      setAmount(transactionObj.amount ? String(transactionObj.amount) : "");
      setDate(transactionObj.date ? new Date(transactionObj.date) : null);
      setTransactionType(
        transactionObj.transactionType === "expense" ? "expense" : "income"
      );
    } else if (!isEditMode) {
      handleResetForm();
    }
  }, [transactionObj, isEditMode]);

  const handleEmojiSelect = (emojiObj: IEmojiObject) => {
    setSelectEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleResetForm = () => {
    setSelectEmoji("💵");
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(null);
    setTransactionType("income");
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!title.trim()) {
      toast.error("Please provide a title");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid positive amount");
      return;
    }
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const payload: ITransactionData = {
      emoji: selectEmoji,
      title: title.trim(),
      category,
      amount: String(numAmount),
      date,
      _id: transactionObj?._id,
      transactionType,
    };

    if (isEditMode) {
      onUpdateTransaction(payload, transactionType);
    } else {
      onAddTransaction(payload, transactionType);
    }

    setShowModal(false);
    handleResetForm();
  };

  const handleOpenChange = (open: boolean) => {
    setShowModal(open);
    if (!open) {
      setIsEditMode(false);
      handleResetForm();
    }
  };

  const categoriesList =
    transactionType === "income"
      ? INCOME_CATEGORY_CONSTANTS
      : EXPENSE_CATEGORY_CONSTANTS;

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogTrigger className="cursor-pointer inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-[0.98]">
        <Plus className="w-4 h-4" />
        Add Transaction
      </DialogTrigger>

      <DialogContent className="bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-2xl max-w-md w-full p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900">
            {isEditMode ? "Edit Transaction" : "Record New Transaction"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            {isEditMode
              ? "Update details for this transaction."
              : "Choose type and record income or expense activity."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Type Toggle */}
          <div className="flex w-full p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                transactionType === "income"
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => {
                setTransactionType("income");
                setCategory("");
              }}
            >
              + Income
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                transactionType === "expense"
                  ? "bg-white text-rose-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => {
                setTransactionType("expense");
                setCategory("");
              }}
            >
              - Expense
            </button>
          </div>

          {/* Emoji & Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Icon & Title
            </label>
            <div className="flex gap-2.5 items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="w-11 h-10 flex items-center justify-center text-2xl border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Choose icon"
                >
                  {selectEmoji}
                </button>
                {showEmojiPicker && (
                  <div className="absolute top-12 left-0 z-50 shadow-2xl rounded-xl">
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <Input
                  placeholder={
                    transactionType === "income"
                      ? "e.g. Salary, Consulting"
                      : "e.g. Groceries, Shopping"
                  }
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Category
            </label>
            <Select
              onValueChange={(val) => setCategory(val ?? "")}
              value={category}
            >
              <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm cursor-pointer">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-slate-200 shadow-xl rounded-xl z-50">
                <SelectGroup>
                  <SelectLabel className="text-xs text-slate-400 font-semibold px-2 py-1.5">
                    {transactionType === "income"
                      ? "Income Sources"
                      : "Expense Categories"}
                  </SelectLabel>
                  {categoriesList.map((item) => (
                    <SelectItem
                      key={item.value}
                      value={item.title}
                      className="cursor-pointer hover:bg-slate-100 rounded-lg text-sm"
                    >
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Amount ($)
              </label>
              <Input
                type="number"
                step="any"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-10 rounded-xl bg-slate-50 border-slate-200 focus:bg-white text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                Date
              </label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger className="inline-flex h-10 w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 hover:bg-slate-100 transition-colors">
                  <span className="truncate">
                    {date ? formatDate(date) : "Select date"}
                  </span>
                  <CalendarIcon className="h-4 w-4 text-slate-400 shrink-0" />
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-white border border-slate-200 shadow-2xl rounded-2xl"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    onSelect={(d) => {
                      setDate(d ?? null);
                      setOpenCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <DialogFooter className="pt-3 border-t border-slate-100 flex gap-2">
            <DialogClose>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className={`rounded-xl font-semibold shadow-sm cursor-pointer text-white ${
                transactionType === "income"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-600 hover:bg-rose-700"
              }`}
            >
              {isEditMode
                ? "Save Changes"
                : `Add ${transactionType === "income" ? "Income" : "Expense"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModel;
