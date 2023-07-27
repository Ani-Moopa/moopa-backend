const express = require("express");
const router = express.Router();
require("dotenv").config();

const API_BASE_URL = process.env.API_BASE_URL;
const API_KEY = process.env.API_KEY;

router.use("/", async (req, res) => {
  try {
    switch (req.method) {
      case "POST": {
        const { providerId, watchId, episode, id, sub } = req.body;
        const response = await fetch(
          `${API_BASE_URL}/sources?apikey=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              providerId: providerId,
              watchId: watchId,
              episode: episode,
              id: id,
              subType: sub || "sub",
            }),
          }
        );
        const data = await response.json();

        return res.status(201).json(data);
      }
      case "GET": {
        return res.status(200).json({
          error: "Method not allowed",
          message: "Use POST instead and fill in the body",
          body: {
            providerId: "string",
            watchId: "string",
            episode: "number",
            id: "number",
            sub: "sub | dub",
          },
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
