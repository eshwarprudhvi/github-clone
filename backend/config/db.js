import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  
  const MONGODB_URL = process.env.MONGODB_URL;
  if (!MONGODB_URL) {
    console.error("MONGODB_URL is not defined in .env");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URL);
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection error:", err.message);
  }
};

export default connectDB;
