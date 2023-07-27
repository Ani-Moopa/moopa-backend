const express = require("express");
const apicache = require("apicache");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

let cache = apicache.middleware;

const API_BASE_URL = process.env.CONSUMET_BASE_URL;

router.get("/:provider/:id", cache("10 minutes"), async (req, res) => {
  try {
    const id = req.params.id;
    const provider = req.params.provider;

    let datas;

    const { data } = await axios.get(
      `${API_BASE_URL}/meta/anilist/watch/${id}?provider=${provider}`
    );

    if (data) {
      datas = data;
    }

    if (!datas) {
      return res.status(404).json({ message: "Source not found" });
    }

    res.status(200).json(datas);
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
