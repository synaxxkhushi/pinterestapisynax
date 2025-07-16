const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.get("/api/pinterest-download", async (req, res) => {
  const pinUrl = req.query.url;

  if (!pinUrl) {
    return res.status(400).json({ success: false, message: "Missing Pinterest URL" });
  }

  try {
    const { data: html } = await axios.get(pinUrl);
    const $ = cheerio.load(html);

    // Attempt to find the direct image URL from og:image meta tag
    const imageUrl = $('meta[property="og:image"]').attr("content");

    if (imageUrl) {
      res.json({ success: true, image: imageUrl });
    } else {
      res.status(404).json({ success: false, message: "Image not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Error fetching Pinterest image" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
