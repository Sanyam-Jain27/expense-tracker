import { Request, Response } from "express";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";
import { getOrCreateUser } from "../utils/user.helper";

const getAllTransaction = async (req: Request, res: Response) => {
  try {
    const user = await getOrCreateUser(req);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized or user not found" });
    }

    const allIncome = await Income.find({ userId: user._id })
      .select("-__v -userId")
      .lean();

    const allExpense = await Expense.find({ userId: user._id })
      .select("-__v -userId")
      .lean();

    const allTransaction = [...allIncome, ...allExpense].sort((a: any, b: any) => {
      const dateA = new Date(a.date || a.createdAt).getTime();
      const dateB = new Date(b.date || b.createdAt).getTime();
      return dateB - dateA; // Newest first
    });

    return res.status(200).json({
      transaction: allTransaction,
      message: "Successfully retrieved all transactions",
    });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    return res.status(500).json({ message: "Error retrieving transactions" });
  }
};

export { getAllTransaction };