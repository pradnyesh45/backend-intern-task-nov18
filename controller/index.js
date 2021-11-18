const videoModel = require("../models");

// Home Page Hello
module.exports.home = (req, res) => {
  res.send("Hello Visitor! Pradnyesh Aglawe Welcomes you to this page!!!");
};

// get videos using page and size query
module.exports.getAllVideos = async (req, res) => {
  try {
    let { page, size } = req.query;
    console.log("page:", page, "size:", size);
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
};

// search with help of title or description
module.exports.search = async (req, res) => {
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
};
