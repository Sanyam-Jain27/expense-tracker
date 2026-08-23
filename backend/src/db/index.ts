import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongouri = process.env.MONGODB_URI;
  if (!mongouri) {
    throw new Error("MONGODB_URI is not defined");
  }

  const connectionInstance = await mongoose.connect(mongouri);
  isConnected = true;
  console.log("MongoDB connected:", connectionInstance.connection.host);
};

export default connectDB;