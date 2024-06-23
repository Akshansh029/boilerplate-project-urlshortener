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
// function isValidUrl(string) {
//   try {
//     const url = new URL(string);
//     return url.protocol === "http:" || url.protocol === "https:";
//   } catch (error) {
//     return false;
//   }
// }
// Helper function to validate URL
function isValidUrl(string) {
  if (!string) {
    return false;
  }
  try {
    const url = new URL(string);
    return true;
  } catch (error) {
    return false;
  }
}

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
