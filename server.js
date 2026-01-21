const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

/* ---------- HOME ---------- */
app.get("/", (req, res) => {
  res.send("NSE Option Chain API is running");
});

/* ---------- PING (Render wake check) ---------- */
app.get("/ping", (req, res) => {
  res.send("pong");
});

/* ---------- OPTION CHAIN ---------- */
app.get("/option-chain/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    const url =
      symbol === "BANKNIFTY"
        ? "https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY"
        : "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/"
      },
      timeout: 10000
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({
      error: "NSE fetch failed",
      message: err.message
    });
  }
});

/* ---------- START SERVER ---------- */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
