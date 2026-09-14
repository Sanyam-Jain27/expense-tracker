import { Request, Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";
import { getOrCreateUser } from "../utils/user.helper";

const addIncome = async (req: Request, res: Response) => {
  try {
    const { title, emoji, category, amount, date } = req.body;
    const isIncomeDataEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || field === ""
    );
    if (isIncomeDataEmpty) {
      return res.status(400).json({ message: "All income fields are required" });
    }

    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const income = await Income.create({
      transactionType: "income",
      title,
      emoji: emoji || "💰",
      category,
      amount: String(amount),
      date: new Date(date),
      userId: user._id,
    });

    if (!income) {
      return res.status(500).json({ message: "Failed to create income" });
    }

    (user.incomes as any).push(income._id);
    await user.save();

    return res.status(201).json({
      message: "Income added successfully",
      income,
    });
  } catch (error) {
    console.error("Error adding income:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getUserIncome = async (req: Request, res: Response) => {
  try {
    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const incomes = await Income.find({ userId: user._id })
      .select("-__v -userId")
      .sort({ date: -1 });

    return res.status(200).json({
      incomes,
      message: "Incomes fetched successfully",
    });
  } catch (error) {
    console.error("Error fetching incomes:", error);
    return res.status(500).json({ message: "Failed to fetch incomes" });
  }
};

const updateIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, emoji, category, amount, date } = req.body;
    const isIncomeDataEmpty = [title, emoji, category, amount, date].some(
      (field) => field === undefined || field === null || field === ""
    );
    if (isIncomeDataEmpty) {
      return res.status(400).json({ message: "All income fields are required" });
    }

    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const updatedIncome = await Income.findOneAndUpdate(
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

    if (!updatedIncome) {
      return res.status(404).json({ message: "Income not found or update failed" });
    }

    return res.status(200).json({
      message: "Income updated successfully",
      income: updatedIncome,
    });
  } catch (error) {
    console.error("Error updating income:", error);
    return res.status(500).json({ message: "Error updating income" });
  }
};

const deleteIncome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deletedIncome) {
      return res.status(404).json({ message: "Income not found" });
    }

    await User.updateOne({ _id: user._id }, { $pull: { incomes: id } });

    return res.status(200).json({ message: "Income deleted successfully" });
  } catch (error) {
    console.error("Error deleting income:", error);
    return res.status(500).json({ message: "Error deleting income" });
  }
};

export { addIncome, getUserIncome, updateIncome, deleteIncome };