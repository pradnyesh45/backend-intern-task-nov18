const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
require("dotenv").config();
const videoModel = require("./models");

app.use(express.json());

const date = new Date();

//RFC 3339 format
const formatted = date.toISOString();

// console.log(process.env.GOOGLE_TOKEN);
const { google } = require("googleapis");
// google
//   .youtube("v3")
//   .search.list({
//     key: process.env.GOOGLE_TOKEN,
//     //   type: video,
//     //   order: date,
//     //   publishedAfter: formatted,
//     part: "snippet",
//     q: "football",
//   })
//   .then((response) => {
//     // console.log(response.data.snippet);
//     const { data } = response;
//     data.items.forEach((item) => {
//       console.log(item.snippet.title);
//     });
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// function to fetch video information from youtube api
async function fetchVideos() {
  return await google.youtube("v3").search.list({
    key: process.env.GOOGLE_TOKEN,
    //   type: video,
    //   order: date,
    //   publishedAfter: formatted,
    part: "snippet",
    q: "football",
  });
  //   let response = await fetch("https://www.googleapis.com/youtube/v3/search");
  //   console.log(response);
}

async function enterVideoInfo(item) {
  let video = new videoModel(
    item.snippet.title,
    item.snippet.description,
    item.snippet.publishedAt,
    item.snippet.thumbnailUrls
  );
  return video;
}

// This function will execute every 10 seconds
setInterval(async () => {
  try {
    let response = await fetchVideos();
    const { data } = response;
    data.items.forEach((item) => {
      videoModel.findOne({ title: item.snippet.title }, async (err, video) => {
        if (!err && !video) {
          let video = enterVideoInfo(item);
          await video.save();
        }
      });
      //   console.log(item.snippet);
    });
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
}, 10000);

// Hello world on /
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/serchOnYouTube", (req, res) => {});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error to mongoDB: "));
db.once("open", function () {
  console.log("Connected successfully to mongoDB");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
