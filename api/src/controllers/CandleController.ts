import { Candle, CandleModel } from "../models/CandleModel";

export default class CandleController {
  async save(candle: Candle) {
    const newCandle = await CandleModel.create(candle);
    return newCandle;
  }

  async findLastCandle(quantity = 10) {
    const lastCandles: Candle[] = await CandleModel.find()
      .sort({ _id: -1 })
      .limit(quantity);
    return lastCandles;
  }
}
