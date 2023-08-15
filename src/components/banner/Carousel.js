import { makeStyles } from "@material-ui/core";
import axios from "axios";
import { useEffect, useState } from "react";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { TrendingCoins } from "../../Api/api";
import { Cryptostate } from "../../cryptoContext";
import "react-alice-carousel/lib/alice-carousel.css";

const useStyles = makeStyles((theme) => ({
  carousel: {
    backgroundColor: "#00008B",
    borderRadius: "25px",
    height: "50%",
    display: "flex",
    alignItems: "center",
  },
  carouselItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    textTransform: "uppercase",
    color: "gold",
  },
}));

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Carousel = () => {
  const classes = useStyles();

  const [trending, setTrending] = useState([]);

  const { currency, symbol } = Cryptostate();

  const fetchTrendingCoin = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));

      // console.log(data);

      setTrending(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchTrendingCoin();
    // eslint-disable-next-line
  }, [currency]);

  const items = trending.map((coin) => {
    let profit = coin?.price_change_percentage_24h >= 0;

    return (
      <Link className={classes.carouselItem} to={`/coins/${coin.id}`}>
        <img
          src={coin?.image}
          alt={coin.name}
          height="80"
          style={{ marginBottom: 10 }}
        />
        <span>
          {coin?.symbol}
          &nbsp;
          <span style={{ color: profit > 0 ? "#0ecb81" : "red" }}>
            {profit && "+"}
            {coin?.price_change_percentage_24h?.toFixed(2)}
          </span>
        </span>
        <span style={{ fontSize: 22, fontWeight: 500 }}>
          {symbol}
          {numberWithCommas(coin?.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });
  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  return (
    <div className={classes.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlayInterval={1000}
        animationDuration={1500}
        disableDotsControls
        disableButtonsControls
        responsive={responsive}
        items={items}
        autoPlay
      />
    </div>
  );
};

export default Carousel;
