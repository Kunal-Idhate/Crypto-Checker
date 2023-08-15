import React, { useEffect, useState } from "react";
import { Cryptostate } from "../cryptoContext";
import { HistoricalChart } from "../Api/api";
import axios from "axios";
import {
  CircularProgress,
  ThemeProvider,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { chartDays } from "../config/data";
import SelectButton from "./SelectButton";

ChartJs.register(LineElement, CategoryScale, LinearScale, PointElement);

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const useStyles = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

const CoinInfo = ({ coin }) => {
  const [historicData, setHistoriacData] = useState();

  const [days, setDays] = useState(1);

  const [flag, setflag] = useState(false);

  const { currency } = Cryptostate();

  const classes = useStyles();

  const fetchData = async () => {
    try {
      const { data } = await axios.get(
        HistoricalChart(coin.id, days, currency)
      );
      setflag(true);
      setHistoriacData(data.prices);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [days, currency]);

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <div className={classes.container}>
          {!historicData | (flag === false) ? (
            <CircularProgress
              style={{ color: "gold" }}
              size={200}
              thickness={1}
            />
          ) : (
            <>
              <Line
                data={{
                  labels: historicData.map((coin) => {
                    let date = new Date(coin[0]);
                    let time =
                      date.getHours() > 12
                        ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                        : `${date.getHours()}:${date.getMinutes()} AM`;
                    return days === 1 ? time : date.toLocaleDateString();
                  }),
                  datasets: [
                    {
                      data: historicData.map((coin) => coin[1]),
                      label: `Price ( Past ${days} Days ) in ${currency}`,
                      borderColor: "#EEBC1D",
                    },
                  ],
                }}
                options={{
                  plugins: {
                    datalabels: {
                      display: true, // Set to true to display data labels
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false, // Set to true to display x-axis grid lines
                      },
                    },
                    y: {
                      grid: {
                        color: "#FFFFFF", // Color of the grid lines
                        lineWidth: 0.4,
                      },
                    },
                  },

                  elements: {
                    point: {
                      radius: 1,
                    },
                  },
                }}
              />
              <div
                style={{
                  display: "flex",
                  marginTop: 20,
                  justifyContent: "space-around",
                  width: "100%",
                }}
              >
                {chartDays.map((day) => (
                  <SelectButton
                    key={day.value}
                    onClick={() => {
                      setDays(day.value);
                      setflag(false);
                    }}
                    selected={day.value === days}
                  >
                    {day.label}
                  </SelectButton>
                ))}
              </div>
            </>
          )}
        </div>
      </ThemeProvider>
    </>
  );
};

export default CoinInfo;
