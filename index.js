const express = require("express");
const app = express();
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

mongoose.Promise = global.Promise;

const port = 3000;
require("dotenv").config();
const videoModel = require("./model");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    type: "video",
    order: "date",
    publishedAfter: "2021-01-01T00:00:00Z",
    maxResults: "5",
  });
  //   let response = await fetch("https://www.googleapis.com/youtube/v3/search");
  //   console.log(response);
}

async function enterVideoInfo(item) {
  // let thumbailUrls = [];
  // item.snippet.forEach((url) => {

  // })
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
    let response = await fetchVideos();
    const { data } = response;
    data.items.forEach(async (item) => {
      //   console.log("description", item.snippet.description);
      //   console.log("thumbailUrls", item.snippet.thumbnails.default.url);
      let video = await videoModel.findOne({ title: item.snippet.title });
      try {
        if (!video) {
          enterVideoInfo(item);
          //   console.log("video", video);
          //   await video.save();
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

// Hello world on /
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

app.get("/getAllVideos", async (req, res) => {
  try {
    let { page, size } = req.query;
    console.log("page:", page, "size:", size);
    // const { limit, offset } = getPagination(page, size);
    page = Number(page);
    size = Number(size);
    const data = await videoModel
      .find({})
      .sort({ publishedAt: -1 })
      .skip((page - 1) * size)
      .limit(size);

    if (data) {
      res.status(200).json({
        data,
      });
    }
  } catch (error) {
    console.log(error);
  }
  // try {
  //   const data = videoModel.paginate({}, { offset, limit });
  //   //   .sort({ publishedAt: 1 });
  //   if (data) {
  //     res.status(200).json({
  //       data,
  //     });
  //   }
  // } catch (error) {
  //   console.log(error);
  // }
});

app.post("/search", async (req, res) => {
  try {
    const { title, description } = req.body;
    const data = await videoModel.find({
      $or: [{ title: title }, { description: description }],
    });
    res.status(200).json({
      data,
    });
  } catch (error) {
    console.log(error);
  }
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
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
