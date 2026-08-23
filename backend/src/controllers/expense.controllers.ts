import { clerkClient, getAuth } from "@clerk/express";
import { Request,Response } from "express";
import { User } from "../models/user.model";
import { Expense } from "../models/expense.model";
const addExpense=async (req:Request,res:Response)=>{
    try{
        const {title,emoji,category,amount,date}=req.body
        const {userId}=getAuth(req);
        const clerkUser =await clerkClient.users.getUser(userId||"")
        const email =clerkUser.primaryEmailAddress?.emailAddress;
        const isExpenseDataEmpty = [title, emoji, category, amount, date].some((field) => !field);
        if(isExpenseDataEmpty){
        return res.status(400).json({message:"all Expense field are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const expense =await Expense.create({
            transactionType:"expense",
            title,
            emoji,
            category,
            amount,
            date,
            userId:user._id
        })
        if(!expense){
            return res.status(490).json({message:"not created Expense"})
        }
        user.expenses.push(expense._id);
        await user.save();
        return res.status(200).json({message:"Expense is added"})
    }catch(error){
        return res.status(400).json({message:"internal server error"})
    }
}
const getUserExpense=async (req:Request,res:Response)=>{
    try{
    const {userId}=getAuth(req);
    const clerkUser =await clerkClient.users.getUser(userId||"")
    const email =clerkUser.primaryEmailAddress?.emailAddress;
    const user = await User.findOne({ email }).lean()
    .populate({path:"expenses",select:"-__v -userId"});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({
        expenses: user.expenses,
        message: "Expense fetched successfully",
      });
    }
    catch(error){
        return res.status(404).json({message:"some error occur while geting Expense"})
    }

}
const updateExpense = async (req:Request,res:Response)=>{
    try{
    const {userId}=getAuth(req);
    const {id}=req.params;
    const {title,emoji,category,amount,date}=req.body
    const isExpenseDataEmpty = [title, emoji, category, amount, date].some((field) => !field);
        if(isExpenseDataEmpty){
        return res.status(400).json({message:"all Expense field are required"})
        }
    const clerkUser =await clerkClient.users.getUser(userId||"")
    const email =clerkUser.primaryEmailAddress?.emailAddress;
    const user = await User.findOne({ email })
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const updatedExpense =await Expense.findOneAndUpdate(
        {
            _id:id,
            userId:user._id
        },
        {
            $set:{
                title,emoji,category,amount,date
            }
        }
    )
    if(!updatedExpense){
        return res.status(404).json({message:"Expense not updated"})
    }
    return res.status(200).json({message:"updated succesfully"})
    }
    catch(error){
        return res.status(404).json({message:"Expense not updated sometihng went wrong "})
    }

}
const deleteExpense =async (req:Request,res:Response)=>{
    try{
        const {userId}=getAuth(req);
        const {id}=req.params;
        const clerkUser =await clerkClient.users.getUser(userId||"")
        const email =clerkUser.primaryEmailAddress?.emailAddress;
        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const deleteExpense =await Expense.findOneAndDelete(
            {
                _id:id,
                userId:user._id
            }
        )
        if(!deleteExpense){
            return res.status(404).json({message:"Expense not deleted"})
        }
        await User.updateOne({_id:user._id},{$pull:{Expenses:id}})
        return res.status(200).json({message:"updated succesfully"})
        }
        catch(error){
            return res.status(404).json({message:"Expense not updated sometihng went wrong "})
        }

}
export {addExpense,getUserExpense,updateExpense,deleteExpense};