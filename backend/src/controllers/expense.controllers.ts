import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";
import { getOrCreateUser } from "../utils/user.helper";

const addExpense = async (req: Request, res: Response) => {
  try {
    const { title, emoji, category, amount, date } = req.body;
    const isExpenseDataEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || field === ""
    );
    if (isExpenseDataEmpty) {
      return res.status(400).json({ message: "All expense fields are required" });
    }

    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const expense = await Expense.create({
      transactionType: "expense",
      title,
      emoji: emoji || "💸",
      category,
      amount: String(amount),
      date: new Date(date),
      userId: user._id,
    });

    if (!expense) {
      return res.status(500).json({ message: "Failed to create expense" });
    }

    (user.expenses as any).push(expense._id);
    await user.save();

    return res.status(201).json({
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    console.error("Error adding expense:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserExpense = async (req: Request, res: Response) => {
  try {
    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const expenses = await Expense.find({ userId: user._id })
      .select("-__v -userId")
      .sort({ date: -1 });

    return res.status(200).json({
      expenses,
      message: "Expenses fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

const updateExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, emoji, category, amount, date } = req.body;
    const isExpenseDataEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || field === ""
    );
    if (isExpenseDataEmpty) {
      return res.status(400).json({ message: "All expense fields are required" });
    }

    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const updatedExpense = await Expense.findOneAndUpdate(
      {
        _id: id,
        userId: user._id,
      },
      {
        $set: {
          title,
          emoji,
          category,
          amount: String(amount),
          date: new Date(date),
        },
      },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found or update failed" });
    }

    return res.status(200).json({
      message: "Expense updated successfully",
      expense: updatedExpense,
    });
  } catch (error) {
    console.error("Error updating expense:", error);
    return res.status(500).json({ message: "Error updating expense" });
  }
};

const deleteExpense = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Fix bug: lowercase expenses
    await User.updateOne({ _id: user._id }, { $pull: { expenses: id } });

    return res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return res.status(500).json({ message: "Error deleting expense" });
  }
};

export { addExpense, getUserExpense, updateExpense, deleteExpense };