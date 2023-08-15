import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Homepage from "./pages/Homepage";
import CoinPage from "./pages/CoinPage";
import { makeStyles } from "@material-ui/core";
import { useEffect, useState } from "react";
import CryptoContext from "./cryptoContext";

const useStyles = makeStyles({
  App: {
    backgroundColor: "#03033d",
    color: "white",
    minHeight: "100vh",
  },
});
export default function App() {
  const classes = useStyles();
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  return (
    <CryptoContext.Provider value={{ currency, setCurrency, symbol }}>
      <BrowserRouter>
        <div className={classes.App}>
          <Header />
          <Routes>
            <Route exact path="/" Component={Homepage} />
            <Route path="/coins/:id" Component={CoinPage} />
          </Routes>
        </div>
      </BrowserRouter>
    </CryptoContext.Provider>
  );
}
