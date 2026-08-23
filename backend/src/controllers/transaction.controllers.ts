import { clerkClient,getAuth } from "@clerk/express";
import { Request,Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";
import { Expense } from "../models/expense.model";

const getAllTransaction = async (req:Request,res:Response)=>{
    try{
        const {userId} =getAuth(req);
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: Missing user token" });
          }
        const clerkUser =await clerkClient.users.getUser(userId||"");
        const email =clerkUser.primaryEmailAddress?.emailAddress;
        if (!email) {
            return res.status(400).json({ message: "Clerk user email not found" });
          }
        const user =await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found in getallT"});
        }
        const allIncome =await Income.find({_id:{$in:user.incomes}}).sort({createdAt:-1})
        const allExpense =await Expense.find({_id:{$in:user.expenses}}).sort({createdAt:-1})
        const allTransaction =[...allIncome,...allExpense].sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime())
        .reverse();
        return res.status(200).json({
            transaction:allTransaction,
            message:"succesfully send all transaction"
        })
    }catch(error){
        res.status(400).json({message:"error while get all transaction"})
    }
}
export {getAllTransaction}