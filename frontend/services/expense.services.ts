import axios from "axios"
import { ITransactionData } from "@/utils/types"
import { APP_API_URL } from "@/utils/constants"
const addExpense =async (payload:ITransactionData,token:string)=>{
    try{
        await axios.post(`${APP_API_URL}/expense/add-expense`,payload,{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
            }
        })
    }catch(error){
        throw error;
    }
}

const fetchExpense =async(token:string)=>{
    try{
        const response=await axios.get(`${APP_API_URL}/expense/get-expense`,{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
            }
        })
        return response?.data?.expenses;
    }catch(error){
        throw error
    }
}

const updateExpense =async(payload:ITransactionData,id:string,token:string)=>{
    try{
        await axios.post(`${APP_API_URL}/expense/update-expense/${id}`,payload,{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
            }
        })
    }
    catch(error){
        throw error
    }
}
const deleteExpense =async(id:string,token:string)=>{
    try{
        await axios.delete(`${APP_API_URL}/expense/delete-expense/${id}`,{
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json",
            }
        })
    }
    catch (error){
        throw error;
    }
}

export {addExpense,fetchExpense,updateExpense,deleteExpense}