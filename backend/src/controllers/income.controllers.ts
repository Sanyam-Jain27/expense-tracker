import { clerkClient, getAuth } from "@clerk/express";
import { Request,Response } from "express";
import { User } from "../models/user.model";
import { Income } from "../models/income.model";
const addIncome=async (req:Request,res:Response)=>{
    try{
        const {title,emoji,category,amount,date}=req.body
        const {userId}=getAuth(req);
        const clerkUser =await clerkClient.users.getUser(userId||"")
        const email =clerkUser.primaryEmailAddress?.emailAddress;
        const isIncomeDataEmpty = [title, emoji, category, amount, date].some((field) => !field);
        if(isIncomeDataEmpty){
        return res.status(400).json({message:"all income field are required"})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const income =await Income.create({
            transactionType:"income",
            title,
            emoji,
            category,
            amount,
            date,
            userId:user._id
        })
        if(!income){
            return res.status(490).json({message:"not created income"})
        }
        user.incomes.push(income._id);
        await user.save();
        return res.status(200).json({message:"income is added"})
    }catch(error){
        return res.status(400).json({message:"internal server error"})
    }
}
const getUserIncome=async (req:Request,res:Response)=>{
    try{
    const {userId}=getAuth(req);
    const clerkUser =await clerkClient.users.getUser(userId||"")
    const email =clerkUser.primaryEmailAddress?.emailAddress;
    const user = await User.findOne({ email }).lean()
    .populate({path:"incomes",select:"-__v -userId"});
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    return res.status(200).json({
        incomes: user.incomes,
        message: "Income fetched successfully",
      });
    }
    catch(error){
        return res.status(404).json({message:"some error occur while geting income"})
    }

}
const updateIncome = async (req:Request,res:Response)=>{
    try{
    const {userId}=getAuth(req);
    const {id}=req.params;
    const {title,emoji,category,amount,date}=req.body
    const isIncomeDataEmpty = [title, emoji, category, amount, date].some((field) => !field);
        if(isIncomeDataEmpty){
        return res.status(400).json({message:"all income field are required"})
        }
    const clerkUser =await clerkClient.users.getUser(userId||"")
    const email =clerkUser.primaryEmailAddress?.emailAddress;
    const user = await User.findOne({ email })
    if(!user){
        return res.status(404).json({message:"user not found"})
    }
    const updatedIncome =await Income.findOneAndUpdate(
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
    if(!updatedIncome){
        return res.status(404).json({message:"income not updated"})
    }
    return res.status(200).json({message:"updated succesfully"})
    }
    catch(error){
        return res.status(404).json({message:"income not updated sometihng went wrong "})
    }

}
const deleteIncome =async (req:Request,res:Response)=>{
    try{
        const {userId}=getAuth(req);
        const {id}=req.params;
        const clerkUser =await clerkClient.users.getUser(userId||"")
        const email =clerkUser.primaryEmailAddress?.emailAddress;
        const user = await User.findOne({ email })
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        const deleteIncome =await Income.findOneAndDelete(
            {
                _id:id,
                userId:user._id
            }
        )
        if(!deleteIncome){
            return res.status(404).json({message:"income not deleted"})
        }
        await User.updateOne({_id:user._id},{$pull:{incomes:id}})
        return res.status(200).json({message:"updated succesfully"})
        }
        catch(error){
            return res.status(404).json({message:"income not updated sometihng went wrong "})
        }

}
export {addIncome,getUserIncome,updateIncome,deleteIncome};