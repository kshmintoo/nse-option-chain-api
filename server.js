import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());

const headers = {
  "User-Agent": "Mozilla/5.0",
  "Accept": "application/json",
  "Referer": "https://www.nseindia.com"
};

async function hitHome() {
  await fetch("https://www.nseindia.com", { headers });
}

app.get("/option-chain/:symbol", async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    await hitHome();

    const url =
      symbol === "BANKNIFTY"
        ? "https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY"
        : "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";

    const response = await fetch(url, { headers });
    const data = await response.json();

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "NSE fetch failed" });
  }
});

app.get("/", (req, res) => {
  res.send("NSE Option Chain API Running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
