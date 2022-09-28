import CandleColor from "../enums/CandleColor";

export default class Candle {
  low: number;
  high: number;
  open: number;
  close: number;
  color: CandleColor;
  values: number[];
  currency: string;
  initialDateTime: Date;
  finalDateTime: Date;

  constructor(currency: string, initialDateTime: Date) {
    this.currency = currency;
    this.initialDateTime = initialDateTime;
    this.low = Infinity;
    this.high = 0;
    this.open = 0;
    this.close = 0;
    this.values = [];
    this.color = CandleColor.UNDETERMINED;
  }

  addValue(value: number) {
    this.values.push(value);
    this.low = Math.min(this.low, value);
    this.high = Math.max(this.high, value);
    this.open = this.open || value;
    this.close = value;
    this.color = this.close > this.open ? CandleColor.GREEN : CandleColor.RED;
  }

  closeCandle(finalDateTime: Date) {
    if (this.values.length > 0) {
      this.close = this.values[this.values.length - 1];
      this.finalDateTime = new Date();

      if (this.close > this.open) {
        this.color = CandleColor.GREEN;
      } else if (this.close < this.open) {
        this.color = CandleColor.RED;
      } else {
        this.color = CandleColor.UNDETERMINED;
      }
    }
  }

  toSimpleObject() {
    return {
      currency: this.currency,
      initialDateTime: this.initialDateTime,
      finalDateTime: this.finalDateTime,
      open: this.open,
      close: this.close,
      high: this.high,
      low: this.low,
      color: this.color,
    };
  }
}
