const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("What are you looking at huh?");
});

module.exports = router;
