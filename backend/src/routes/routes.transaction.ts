import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { getAllTransaction } from "../controllers/transaction.controllers";
const router = Router();

router.route("/get-alltransaction").get(requireAuth(),getAllTransaction)
export default router ;