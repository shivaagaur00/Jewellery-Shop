import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const URL = process.env.MONGODB_URL;
export const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
