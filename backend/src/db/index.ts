import mongoose from "mongoose"
const connectDB = async ()=>{
    try{
        const mongouri =process.env.MONGODB_URI;
        if(!mongouri){
            console.log("uri is not there")
            process.exit(1)
        }
        const connectionInstance = await mongoose.connect(mongouri)
        console.log("Mongodb connected :",connectionInstance.connection.host);
    }
    catch (error){
        console.log("mongodb connection error",error)
    }
}
export default connectDB;