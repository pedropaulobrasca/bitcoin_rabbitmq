import { config } from "dotenv";
import { connect } from "mongoose";

config();

export const connectToMongoDB = async () => {
  try {
    await connect(process.env.MONGODB_CONNECTION_URL);
    console.log("🎲 Connected to MongoDB");
  } catch (error) {
    console.log("❌ Failed to connect to MongoDB");
    console.error(error);
    return process.exit(1);
  }
};
