import axios from "axios";
import React, { useState } from "react";
import { CoinList } from "../Api/api";
import { Cryptostate } from "../cryptoContext";
import { useEffect } from "react";
import {
  Container,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "./banner/Carousel";
import { Pagination } from "@material-ui/lab";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#fff",
    },
    type: "dark",
  },
});

const useStyles = makeStyles({
  row: {
    backgroundColor: "#03033d",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#060694",
    },
    fontFamily: "Montserrat",
  },
  pagination: {
    "& .MuiPaginationItem-root": {
      color: "gold",
    },
  },
});

const CoinsTable = () => {
  const classes = useStyles();

  const [coins, setConis] = useState([]);

  const [loading, setLoading] = useState(false);

  const [Search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const { currency, symbol } = Cryptostate();
  const navigate = useNavigate();

  const fetchCoins = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(CoinList(currency));
      setConis(data);
      setLoading(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line
  }, [currency]);

  const searchFilter = () => {
    return coins.filter((coin) => {
      return (
        coin.name.toLowerCase().includes(Search) ||
        coin.symbol.toLowerCase().includes(Search)
      );
    });
  };

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <Container style={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            style={{ margin: 18, fontFamily: "Montserrat" }}
          >
            Market prices of Crypto Currency
          </Typography>
          <TextField
            label="Search For a Coin ..."
            variant="outlined"
            style={{ marginBottom: 20, width: "100%" }}
            onChange={(e) => setSearch(e.target.value)}
          />
          <TableContainer component={Paper}>
            {loading ? (
              <LinearProgress style={{ backgroundColor: "gold" }} />
            ) : (
              <>
                <Table aria-label="simple table">
                  <TableHead style={{ backgroundColor: "#EEBC1D" }}>
                    <TableRow>
                      {["Coin", "Price", "24h Change", "Market Cap"].map(
                        (head) => (
                          <TableCell
                            style={{
                              color: "black",
                              fontWeight: "700",
                              fontFamily: "Montserrat",
                            }}
                            key={head}
                            align={head === "Coin" ? "left" : "right"}
                          >
                            {head}
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {searchFilter()
                      .slice((page - 1) * 10, (page - 1) * 10 + 10)
                      .map((coin) => {
                        const profit = coin?.price_change_percentage_24h >= 0;

                        return (
                          <TableRow
                            onClick={() => [navigate(`/coins/${coin.id}`)]}
                            className={classes.row}
                            key={coin.name}
                          >
                            <TableCell
                              component="th"
                              scope="row"
                              style={{
                                display: "flex",
                                gap: 15,
                              }}
                            >
                              <img
                                src={coin?.image}
                                alt={coin.name}
                                height="50"
                                style={{ marginBottom: 10 }}
                              />
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <span
                                  style={{
                                    textTransform: "uppercase",
                                    fontSize: 22,
                                  }}
                                >
                                  {coin.symbol}
                                </span>
                                <span style={{ color: "darkgrey" }}>
                                  {coin.name}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell align="right">
                              {symbol}{" "}
                              {numberWithCommas(coin.current_price.toFixed(2))}
                            </TableCell>
                            <TableCell
                              align="right"
                              style={{
                                color: profit > 0 ? "#0ecb81" : "red",
                                fontWeight: 500,
                              }}
                            >
                              {profit && "+"}
                              {coin.price_change_percentage_24h.toFixed(2)}%
                            </TableCell>
                            <TableCell align="right">
                              {symbol}{" "}
                              {numberWithCommas(
                                coin.market_cap.toString().slice(0, -6)
                              )}
                              M
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </>
            )}
          </TableContainer>
          <Pagination
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "20px",
            }}
            count={searchFilter()?.length / 10}
            classes={{ ul: classes.pagination }}
            onChange={(_, value) => {
              setPage(value);
              window.scroll(0, 450);
            }}
          />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default CoinsTable;
