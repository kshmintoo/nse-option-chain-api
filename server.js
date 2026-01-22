const express = require("express");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("NSE option chain API running");
});

app.get("/option-chain/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    let nseUrl = "";
    if (symbol === "NIFTY") {
      nseUrl = "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";
    } else if (symbol === "BANKNIFTY") {
      nseUrl = "https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY";
    } else {
      return res.json({ error: "Invalid symbol" });
    }

    const response = await fetch(nseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/"
      }
    });

    const data = await response.json();
    res.json(data);

  } catch (err) {
    res.json({ error: "NSE fetch failed" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
