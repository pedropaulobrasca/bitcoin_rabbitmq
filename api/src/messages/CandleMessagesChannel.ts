import { Channel, connect } from "amqplib";
import { config } from "dotenv";
import { Server } from "socket.io";
import * as http from "http";
import CandleController from "../controllers/CandleController";
import { Candle } from "../models/CandleModel";

config();

export default class CandleMessagesChannel {
  private _channel: Channel;
  private _candleCtroller: CandleController;
  private _io: Server;

  constructor(server: http.Server) {
    this._candleCtroller = new CandleController();
    this._io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this._io.on("connection", (socket) => {
      console.log("Socket connected");
      socket.on("disconnect", () => {
        console.log("Socket disconnected");
      });
    });
  }

  private async _createMessageChannel() {
    try {
      const connection = await connect(process.env.AMQP_SERVER);
      this._channel = await connection.createChannel();
      await this._channel.assertQueue(process.env.QUEUE_NAME);
    } catch (error) {
      console.log("Connection error: ", error);
    }
  }

  async consumeMessages() {
    await this._createMessageChannel();
    if (this._channel) {
      this._channel.consume(process.env.QUEUE_NAME, async (message) => {
        const candleObj = JSON.parse(message.content.toString());
        console.log("Candle received: ", candleObj);
        this._channel.ack(message);

        const candle: Candle = candleObj;
        await this._candleCtroller.save(candle);
        console.log("Candle saved");

        this._io.emit(process.env.SOCKET_EVENT_NAME, candle);
        console.log("Candle sent to socket");
      });

      console.log("Candle consumer started");
    }
  }
}
