const express = require("express");
const app = express();
const port = 3000;
require("dotenv").config();

const date = new Date();

//RFC 3339 format
const formatted = date.toISOString();

// console.log(process.env.GOOGLE_TOKEN);
const { google } = require("googleapis");
google
  .youtube("v3")
  .search.list({
    key: process.env.GOOGLE_TOKEN,
    //   type: video,
    //   order: date,
    //   publishedAfter: formatted,
    part: "snippet",
    q: "football",
  })
  .then((response) => {
    // console.log(response.data.snippet);
    const { data } = response;
    data.items.forEach((item) => {
      console.log(item.snippet.title);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// function to fetch video information from youtube api
async function fetchVideos() {
  //   let response = await fetch("https://www.googleapis.com/youtube/v3/search");
  //   console.log(response);
}

// Hello world on /
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// This function will execute every 10 seconds
// setInterval(() => {
//   try {
//     let response = fetchVideos();
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// }, 10000);

app.get("/serchOnYouTube", (req, res) => {});

// For MongoDB
// const { MongoClient } = require("mongodb");
// const uri =
//   "mongodb+srv://pradnyesh45:Raunak13@@cluster0.2mrek.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
