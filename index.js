require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const shortid = require("shortid");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// In-memory database (for demo purposes)
const urlDatabase = {};

// Routes
app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: "invalid url" });
  }
  const shortUrl = shortid.generate();
  urlDatabase[shortUrl] = url;
  res.json({ original_url: url, short_url: shortUrl });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const { short_url } = req.params;
  const originalUrl = urlDatabase[short_url];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: "url not found" });
  }
});

// Helper function to validate URL
function isValidUrl(string) {
  const pattern = /^https?:\/\/www\.[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
  return pattern.test(string);
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
