import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { addExpense, deleteExpense, getUserExpense, updateExpense } from "../controllers/expense.controllers";
const router = Router();

router.route("/add-expense").post(requireAuth(),addExpense)
router.route("/get-expense").get(requireAuth(),getUserExpense)
router.route("/update-expense/:id").post(requireAuth(),updateExpense)
router.route("/delete-expense/:id").delete(requireAuth(),deleteExpense)

export default router ;