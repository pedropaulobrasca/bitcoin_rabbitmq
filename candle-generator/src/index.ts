import { config } from "dotenv";
import axios from "axios";
import Candle from "./models/Candle";
import Period from "./enums/Period";
import { createMessageChannel } from "./messages/messageChannel";

config();

const readMarketPrice = async (): Promise<number> => {
  const response = await axios.get(process.env.PRICES_API);
  return response.data.bitcoin.usd;
};

const generateCandles = async () => {
  const messageChannel = await createMessageChannel();

  if (messageChannel) {
    while (true) {
      const loopTime = Period.FIVE_MINUTES / Period.TEN_SECONDS;
      const candle = new Candle("BTC", new Date());

      console.log("--------------------------------");
      console.log("📈 Generating candle...");

      for (let i = 0; i < loopTime; i++) {
        const price = await readMarketPrice();
        candle.addValue(price);
        console.log(`💲 Market price: #${i + 1} of ${loopTime}`);
        console.log(`📈 Price: ${price}`);
        await new Promise((resolve) => setTimeout(resolve, Period.TEN_SECONDS));
      }

      candle.closeCandle(new Date());
      console.log("📈 Candle generated!");
      const candleObject = candle.toSimpleObject();
      console.log(candleObject);

      const candleJson = JSON.stringify(candleObject);
      messageChannel.sendToQueue(
        process.env.QUEUE_NAME,
        Buffer.from(candleJson)
      );
      console.log("📬 Candle sent to queue!");
    }
  }
};

generateCandles();
