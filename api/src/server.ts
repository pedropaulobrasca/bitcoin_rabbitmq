import { config } from "dotenv";
import { connection } from "mongoose";
import { app } from "./app";
import { connectToMongoDB } from "./config/db";
import CandleMessagesChannel from "./messages/CandleMessagesChannel";

config();

const createServer = async () => {
  await connectToMongoDB();

  const PORT = process.env.PORT || 3000;
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  const candleMsgChannel = new CandleMessagesChannel(server);
  candleMsgChannel.consumeMessages();

  process.on("SIGINT", async () => {
    await connection.close();
    server.close(() => {
      console.log("👋 Server closed");
    });
  });
};

createServer();
