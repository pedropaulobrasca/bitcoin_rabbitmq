import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

import "./App.css";

const socket = io("http://localhost:3000");

const options: ApexOptions = {
  chart: {
    height: 350,
    type: "candlestick",
  },
  title: {
    text: "CandleStick Chart",
    align: "left",
  },
  xaxis: {
    type: "datetime",
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
  },
};

function App() {
  const [candles, setCandles] = useState<any>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);

  function setSeries(data: any) {
    const series = [
      {
        data: data,
      },
    ];
    return series;
  }

  // Inicialmente, faz uma requisição para pegar os candles 30 ultimos candles
  useEffect(() => {
    axios
      .get("http://localhost:3000/candles/100")
      .then((response) => {
        response.data.map((candle: any) => {
          setCandles((candles: any) => [
            ...candles,
            {
              x: new Date(candle.finalDateTime),
              y: [candle.open, candle.high, candle.low, candle.close],
            },
          ]);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // http://localhost:3000/candles/5
  // conecta no socket e recebe os dados
  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("newCandle", (data: any) => {
      // push new candle to the array
      setCandles((prev: any) => [
        ...prev,
        {
          x: new Date(data.finalDateTime),
          y: [data.open, data.high, data.low, data.close],
        },
      ]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("newCandle");
    };
  }, []);

  // Toda vez que o estado candles for alterado, ele vai chamar a função setSeries
  useEffect(() => {
    setSeries(candles);
  }, [candles]);

  return (
    <div className="App">
      <p style={isConnected ? { color: "green" } : { color: "red" }}>
        Connected: {"" + isConnected}
      </p>
      <Chart
        options={options}
        series={setSeries(candles)}
        type="candlestick"
        width={1000}
      />
    </div>
  );
}

export default App;
