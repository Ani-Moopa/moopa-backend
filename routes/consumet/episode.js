const express = require("express");
const apicache = require("apicache");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

let cache = apicache.middleware;

const API_BASE_URL = process.env.CONSUMET_BASE_URL;

router.get("/:id", cache("10 minutes"), async (req, res) => {
  try {
    const id = req.params.id;

    const providers = ["enime", "gogoanime", "zoro"];
    const datas = [];

    async function fetchData(provider) {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/meta/anilist/info/${id}?provider=${provider}`
        );
        if (data.episodes.length > 0) {
          datas.push({
            providerId: provider,
            episodes: data.episodes.reverse(),
          });
        }
        // console.log(data);
      } catch (error) {
        console.error(`Error fetching data for provider '${provider}':`, error);
      }
    }

    await Promise.all(providers.map((provider) => fetchData(provider)));
    if (datas.length === 0) {
      return res.status(404).json({ message: "Anime not found" });
    }

    res.status(200).json({ data: datas });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
