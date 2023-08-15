import {
  AppBar,
  Container,
  Select,
  Toolbar,
  Typography,
  MenuItem,
  makeStyles,
  createTheme,
  ThemeProvider,
} from "@material-ui/core";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Cryptostate } from "../cryptoContext";

const useStyles = makeStyles((theme) => ({
  title: {
    flex: 1,
    color: "gold",
    fontFamily: "Montserrat",
    fontWeight: "bold",
    cursor: "pointer",
  },
}));
const Header = () => {
  const classes = useStyles();

  const { currency, setCurrency } = Cryptostate();

  const navigate = useNavigate();
  // console.log(currency);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
          <Container>
            <Toolbar>
              <Typography
                className={classes.title}
                onClick={() => navigate("/")}
                variant="h5"
              >
                Crypto Checker
              </Typography>

              <Select
                variant="outlined"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                style={{ width: 100, height: 40, marginRight: 15 }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"INR"}>INR</MenuItem>
              </Select>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    </>
  );
};

export default Header;
