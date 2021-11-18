const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
  thumbnailUrls: {
    type: String,
  },
});

const Video = mongoose.model("Video", VideoSchema);

module.exports = Video;
