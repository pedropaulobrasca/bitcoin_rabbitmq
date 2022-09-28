import { Router } from "express";
import CandleController from "../controllers/CandleController";

export const candleRouter = Router();
const candleController = new CandleController();

candleRouter.get("/:quantity", async (req, res) => {
  const quantity = parseInt(req.params.quantity);
  const candles = await candleController.findLastCandle(quantity);
  res.status(200).json(candles);
});
