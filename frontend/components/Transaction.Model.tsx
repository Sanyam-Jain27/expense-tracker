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
import { INCOME_CATEGORY_CONSTANTS, EXPENSE_CATEGORY_CONSTANTS } from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { ITransactionData } from "@/utils/types";
import { toast } from "sonner";

interface TransactionModelProps {
  onAddTransaction: (data: ITransactionData, type: "income" | "expense") => void;
  onUpdateTransaction: (data: ITransactionData, type: "income" | "expense") => void;
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
}: TransactionModelProps) => {
  const [transactionType, setTransactionType] = useState<"income" | "expense">("income");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectEmoji, setSelectEmoji] = useState(transactionObj?.emoji || "👍");
  const [title, setTitle] = useState(transactionObj?.title || "");
  const [category, setCategory] = useState(transactionObj?.category || "");
  const [amount, setAmount] = useState(transactionObj?.amount || "");
  const [date, setDate] = useState<Date | null>(transactionObj?.date || null);
  const [openCalendar, setOpenCalendar] = useState(false);

  const handleEmojiSelect = (emojiObj: IEmojiObject) => {
    setSelectEmoji(emojiObj.emoji);
    setShowEmojiPicker(false);
  };

  const handleSave = () => {
    const payload: ITransactionData = {
      emoji: selectEmoji,
      title,
      category,
      amount,
      date,
      _id: transactionObj?._id,
      transactionType,
    };

    if (!selectEmoji || !title || !category || !amount || !date) {
      toast.error("All fields are required");
      return;
    }

    if (isEditMode) {
      onUpdateTransaction(payload, transactionType);
    } else {
      onAddTransaction(payload, transactionType);
    }
    setShowModal(false);
  };

  const handleResetForm = () => {
    setSelectEmoji("👍");
    setTitle("");
    setAmount("");
    setCategory("");
    setDate(null);
    setTransactionType("income");
  };

  const handleOpenChange = () => {
    setShowModal(!showModal);
    if (!showModal) handleResetForm();
  };

  useEffect(() => {
    if (transactionObj) {
      setTitle(transactionObj.title);
      setCategory(transactionObj.category);
      setSelectEmoji(transactionObj.emoji);
      setAmount(transactionObj.amount);
      setDate(transactionObj.date);
      setTransactionType(transactionObj.transactionType === "expense" ? "expense" : "income");
    }
  }, [transactionObj]);

  const categoriesList =
    transactionType === "income" ? INCOME_CATEGORY_CONSTANTS : EXPENSE_CATEGORY_CONSTANTS;

  return (
    <Dialog open={showModal} onOpenChange={handleOpenChange}>
      <DialogTrigger className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 border border-slate-200 px-4 py-2 rounded-lg text-sm font-medium">
        Add Transaction
      </DialogTrigger>
      <DialogContent className="bg-white text-slate-900 border border-slate-200 shadow-xl dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update details for this transaction"
              : "Record a new income or expense item"}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          {/* Type Toggle */}
          <div className="flex w-full gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                transactionType === "income"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => {
                setTransactionType("income");
                setCategory("");
              }}
            >
              Income
            </button>
            <button
              type="button"
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                transactionType === "expense"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
              onClick={() => {
                setTransactionType("expense");
                setCategory("");
              }}
            >
              Expense
            </button>
          </div>

          {/* Emoji Picker */}
          <div className="relative">
            <span
              className="text-4xl border border-gray-300 py-1 px-2 rounded-md cursor-pointer block"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              {selectEmoji}
            </span>
            {showEmojiPicker && (
              <div className="absolute top-12 left-0 z-50">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>

          <div className="w-full space-y-3">
            <div>
              <span className="font-medium text-sm">Title</span>
              <Input
                className="mt-1"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <Select onValueChange={(val) => setCategory(val??"")} value={category}>
                <SelectTrigger className="w-full cursor-pointer mt-1">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 z-50">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {categoriesList?.map((item) => (
                      <SelectItem key={item.value} value={item.title} className="cursor-pointer">
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <span className="font-medium text-sm">Amount</span>
              <Input
                className="mt-1"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Date</label>
              <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                <PopoverTrigger className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-xs hover:bg-slate-50">
                  <span>{date ? new Date(date).toLocaleDateString() : "Select Date"}</span>
                  <ChevronDownIcon className="h-4 w-4 opacity-50" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white border border-slate-200 shadow-md" align="start">
                  <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      setDate(d ?? null);
                      setOpenCalendar(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button variant="outline" className="cursor-pointer" onClick={handleSave}>
            {isEditMode ? "Update" : "Add"} {transactionType === "income" ? "Income" : "Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionModel;