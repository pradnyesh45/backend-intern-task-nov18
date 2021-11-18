const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { google } = require("googleapis");
// const mongoosePaginate = require("mongoose-paginate-v2");

// mongoose.Promise = global.Promise;

const port = 3000;
require("dotenv").config();
const videoModel = require("./models");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", require("./routes"));

// function to fetch video information from youtube APIs
async function fetchVideos() {
  return await google.youtube("v3").search.list({
    key: process.env.GOOGLE_TOKEN,

    part: "snippet",
    q: "football",
    type: "video",
    order: "date",
    publishedAfter: "2021-01-01T00:00:00Z",
    maxResults: "20",
  });
}

// function to enter teh video information into database
async function enterVideoInfo(item) {
  let video = new videoModel({
    title: item.snippet.title,
    description: item.snippet.description,
    publishedAt: item.snippet.publishedAt,
    thumbnailUrls: item.snippet.thumbnails.default.url,
  });
  video.save();
}

// This function will execute every 10 seconds
setInterval(async () => {
  try {
    // fetch info from youtube apis
    let response = await fetchVideos();
    const { data } = response;
    data.items.forEach(async (item) => {
      let video = await videoModel.findOne({ title: item.snippet.title });
      try {
        if (!video) {
          // enter the info into database
          enterVideoInfo(item);
        }
      } catch (error) {
        console.log(error);
      }

      //   console.log(item.snippet);
    });
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}, 10000);

// mongoose connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error to mongoDB: "));
db.once("open", function () {
  console.log("Connected successfully to mongoDB");
});

// express server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
