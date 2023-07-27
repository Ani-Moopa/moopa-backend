const express = require("express");
const router = express.Router();
const apicache = require("apicache");
const axios = require("axios");

require("dotenv").config();

let cache = apicache.middleware;

const API_BASE_URL = process.env.ANIFY_BASE_URL;
const API_KEY = process.env.API_KEY;

// cache for a week
const getNextSunday = () => {
  const today = new Date();
  const nextSunday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + ((7 - today.getDay() + 1) % 7)
  );
  return nextSunday;
};

const cacheDurationInSeconds = () => {
  const nextSunday = getNextSunday();
  const millisecondsUntilNextSunday = nextSunday.getTime() - Date.now();
  const secondsUntilNextSunday = Math.ceil(millisecondsUntilNextSunday / 1000);
  return secondsUntilNextSunday;
};

router.get(
  "/",
  cache(`${cacheDurationInSeconds()} seconds`),
  async (req, res) => {
    const { data } = await axios.get(
      `${API_BASE_URL}/schedule?apikey=${API_KEY}`
    );

    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Schedule not found" });
    }
  }
);

module.exports = router;
