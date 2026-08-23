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
// import { Button } from "./ui/button";
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
import { INCOME_CATEGORY_CONSTANTS } from "@/utils/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { ITransactionData } from "@/utils/types";
import { toast } from "sonner";
const ExpenseModel = ({
  onAddExpense,
  onUpdateExpense,
  showExpenseModal,
  setshowExpenseModal,
  expenseObj,
  isEditMode,
  setIsEditMode
}: {
  onAddExpense: (expenseData: ITransactionData) => void,
  onUpdateExpense: (expenseData: ITransactionData) => void,
  showExpenseModal:boolean,
  setshowExpenseModal:(value:boolean)=>void,
  expenseObj:ITransactionData|null,
  isEditMode:boolean,
  setIsEditMode:(value:boolean)=>void
}) => {
  const [showEmojiPicker, setshowEmojiPicker] = useState(false);
  const [selectEmoji, setselectEmoji] = useState(expenseObj?.emoji||"👍");
  const [title, settitle] = useState(expenseObj?.title||"");
  const [category, setcategory] = useState(expenseObj?.category||"");
  const [amount, setamount] = useState(expenseObj?.amount||"");
  const [date, setdate] = useState<Date | null>(expenseObj?.date||null);
  const [open, setopen] = useState(false);


  const handleEmojiSelect = (emojiObj: IEmojiObject, event: MouseEvent) => {
    console.log("Selected:", emojiObj.emoji);

    setselectEmoji(emojiObj.emoji);
    setshowEmojiPicker(false);
  };
  const handleAddExpense = () => {
    const expenseData: ITransactionData = {
      emoji: selectEmoji,
      title,
      category,
      amount,
      date,
      _id:expenseObj?._id
    };
    if (!selectEmoji || !title || !category || !amount || !date) {
      toast.error("all field is required");
      return;
    }
    if(isEditMode){
        onUpdateExpense(expenseData)
    }
    else{
        onAddExpense(expenseData);
    }
    setshowExpenseModal(false);

  };
  const handleResetForm = ()=>{
    setselectEmoji("👍")
    settitle("")
    setamount("")
    setcategory("")
    setdate(null)
  }
  const handleOpenChange=()=>{
    setshowExpenseModal(!showExpenseModal)
    if(!showExpenseModal){
        handleResetForm()
    }
  }
  useEffect(()=>{
    if(expenseObj){
        settitle(expenseObj.title)
        setcategory(expenseObj.category)
        setselectEmoji(expenseObj.emoji)
        setamount(expenseObj.amount)
        setdate(expenseObj.date)
    }
  },[expenseObj])
  return (
    <Dialog open={showExpenseModal} onOpenChange={handleOpenChange}>
      {/* Fixed: asChild (lowercase 'h') */}
      <DialogTrigger className="cursor-pointer bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 border border-slate-200">
        Add Expense
      </DialogTrigger>
      <DialogContent className="bg-white text-slate-900 border border-slate-200 shadow-xl dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100">
            Add Expense
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Add Expense to the list in just a few simple steps
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start justify-center gap-4">
          <div className="relative">
            <span
              className="text-4xl border border-gray-300 
            py-1 px-2 rounded-md cursor-pointer"
              onClick={() => setshowEmojiPicker(!showEmojiPicker)}
            >
              {selectEmoji}
            </span>
            {showEmojiPicker ? (
              <div className="absolute top-0 left-15">
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            ) : null}
          </div>
          <div className="w-full">
            <span className="font-medium"> Title</span>
            <Input
              className="mt-2"
              placeholder="Enter Expense title"
              value={title}
              onChange={(e) => settitle(e.target.value)}
            />

            <div className="space-y-1.5 w-full">
              <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                Category
              </label>
              <Select
                onValueChange={(value) => setcategory(value)}
                value={category}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select a Category" />
                </SelectTrigger>

                {/* Added explicit background, border, shadow, and z-index */}
                <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md z-50">
                  <SelectGroup>
                    <SelectLabel>Category</SelectLabel>
                    {INCOME_CATEGORY_CONSTANTS.map((item) => (
                      <SelectItem
                        key={item.value}
                        value={item.title}
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        {item.title}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <span className="font-medium"> Amount</span>
            <Input
              className="mt-2"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setamount(e.target.value)}
            />
            <div className="w-full flex flex-col gap-2">
              <label className="text-sm font-medium leading-none text-slate-700 dark:text-slate-300">
                Date
              </label>

              <Popover open={open} onOpenChange={setopen}>
                <PopoverTrigger className="inline-flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-xs transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800">
                  <span>
                    {date ? new Date(date).toLocaleDateString() : "Select Date"}

                  </span>
                  <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                </PopoverTrigger>

                <PopoverContent
                  className="w-auto p-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={date ?? undefined}
                    captionLayout="dropdown"
                    onSelect={(date) => {
                      setdate(date ?? null);
                      setopen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleAddExpense}
          >
            {isEditMode? "Update Expense":"Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseModel;
