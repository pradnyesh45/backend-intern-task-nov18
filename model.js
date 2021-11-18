const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  decription: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  thumbnailUrls: {
    type: Array,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
