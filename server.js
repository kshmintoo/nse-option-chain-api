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

    let url = "";
    if (symbol === "NIFTY") {
      url = "https://nse-api-proxy.vercel.app/option-chain/NIFTY";
    } else if (symbol === "BANKNIFTY") {
      url = "https://nse-api-proxy.vercel.app/option-chain/BANKNIFTY";
    } else {
      return res.json({ error: "Invalid symbol" });
    }

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.json({ error: "Fetch failed", message: err.message });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
