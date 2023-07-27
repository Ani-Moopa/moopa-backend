const express = require("express");
const axios = require("axios");
const apicache = require("apicache");
const router = express.Router();
require("dotenv").config();

let cache = apicache.middleware;

const API_BASE_URL = process.env.ANIFY_BASE_URL;
const API_KEY_NAME = process.env.API_KEY_NAME;
const API_KEY = process.env.API_KEY;

router.get("/:id", cache("30 minutes"), async (req, res) => {
  try {
    const id = req.params.id;

    const params = new URLSearchParams({
      id: id,
      [API_KEY_NAME]: API_KEY,
    });

    const { data } = await axios.get(`${API_BASE_URL}/episodes?${params}`);
    const { data: episodeCover } = await axios.get(
      `${API_BASE_URL}/episode-covers?${params}`
    );

    // console.log({data, episodeCover})
    res.status(200).json({ data, episodeCover });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
