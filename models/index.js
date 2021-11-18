const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    publishedAt: {
      type: Date,
    },
    thumbnailUrls: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Video = mongoose.model("Video", schema);

module.exports = Video;
