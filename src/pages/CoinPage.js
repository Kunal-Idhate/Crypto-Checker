import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { Cryptostate } from "../cryptoContext";
import { SingleCoin } from "../Api/api";
import axios from "axios";
import {
  Container,
  LinearProgress,
  Typography,
  makeStyles,
} from "@material-ui/core";
import CoinInfo from "../components/CoinInfo";

import { numberWithCommas } from "../components/banner/Carousel";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },
  sidebar: {
    width: "30%",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: 25,
    borderRight: "2px solid grey",
  },
  heading: {
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Montserrat",
  },
  description: {
    width: "100%",
    fontFamily: "Montserrat",
    padding: 25,
    paddingBottom: 15,
    paddingTop: 0,
    textAlign: "justify",
  },
  marketData: {
    alignSelf: "start",
    padding: 25,
    paddingTop: 10,
    width: "100%",
    [theme.breakpoints.down("md")]: {
      display: "flex",
      justifyContent: "space-around",
    },
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
    },
    [theme.breakpoints.down("xs")]: {
      alignItems: "start",
    },
  },
}));

const CoinPage = () => {
  const { id } = useParams();

  const [coin, setCoin] = useState();

  const { currency, symbol } = Cryptostate();

  const classes = useStyles();

  const fetchSingleCoin = async () => {
    try {
      const { data } = await axios.get(SingleCoin(id));
      setCoin(data);
    } catch (err) {
      console.log(err.messege);
    }
  };

  useEffect(() => {
    fetchSingleCoin();
    // eslint-disable-next-line
  }, [currency]);

  if (!coin) return <LinearProgress style={{ backgroundColor: "gold" }} />;

  return (
    <>
      <Container className={classes.container}>
        <div className={classes.sidebar}>
          <img
            src={coin?.image.large}
            alt={coin?.name}
            height="200"
            style={{ marginBottom: 20 }}
          />
          <Typography variant="h3" className={classes.heading}>
            {coin?.name}
          </Typography>
          <Typography
            variant="subtitle2"
            className={classes.description}
            dangerouslySetInnerHTML={{
              __html: coin?.description.en
                .split(". ")[0]
                .concat(". ", coin?.description.en.split(".").slice(0, 1)),
            }}
          ></Typography>
          <div className={classes.marketData}>
            <span style={{ display: "flex" }}>
              <Typography variant="h6" className={classes.heading}>
                Rank:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h6"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {numberWithCommas(coin?.market_cap_rank)}
              </Typography>
            </span>

            <span style={{ display: "flex" }}>
              <Typography variant="h6" className={classes.heading}>
                Current Price:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h6"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.current_price[currency.toLowerCase()]
                )}
              </Typography>
            </span>
            <span style={{ display: "flex" }}>
              <Typography variant="h6" className={classes.heading}>
                Market Cap:
              </Typography>
              &nbsp; &nbsp;
              <Typography
                variant="h6"
                style={{
                  fontFamily: "Montserrat",
                }}
              >
                {symbol}{" "}
                {numberWithCommas(
                  coin?.market_data.market_cap[currency.toLowerCase()]
                    .toString()
                    .slice(0, -6)
                )}
                M
              </Typography>
            </span>
          </div>
        </div>
        <CoinInfo coin={coin} />
      </Container>
    </>
  );
};

export default CoinPage;
