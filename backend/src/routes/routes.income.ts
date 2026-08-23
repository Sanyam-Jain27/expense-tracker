import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { addIncome, deleteIncome, getUserIncome, updateIncome } from "../controllers/income.controllers";
const router = Router();

router.route("/add-income").post(requireAuth(),addIncome)
router.route("/get-income").get(requireAuth(),getUserIncome)
router.route("/update-income/:id").post(requireAuth(),updateIncome)
router.route("/delete-income/:id").delete(requireAuth(),deleteIncome)

export default router ;