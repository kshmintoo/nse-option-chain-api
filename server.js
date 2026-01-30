const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const NSE_URL =
  "https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY";

let cookie = "";
let cachedData = null;

async function setCookie() {
  try {
    const res = await axios.get("https://www.nseindia.com", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    cookie = res.headers["set-cookie"];
  } catch (e) {
    console.log("Cookie fetch failed");
  }
}

async function fetchData() {
  try {
    if (!cookie) await setCookie();

    const res = await axios.get(NSE_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Referer": "https://www.nseindia.com/",
        "Cookie": cookie
      }
    });

    cachedData = res.data;
    console.log("✅ NSE option chain updated");
  } catch (e) {
    console.log("❌ NSE fetch failed, retrying");
    cookie = "";
  }
}

// fetch every 30 sec
setInterval(fetchData, 30000);
fetchData();

// ✅ ROOT TEST
app.get("/", (req, res) => {
  res.send("NSE option chain API running");
});

// ✅ MAIN API
app.get("/api/option-chain", (req, res) => {
  if (!cachedData) {
    return res.status(503).json({ error: "Data loading" });
  }
  res.json(cachedData);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () =>
  console.log("Server running on port", PORT)
);
