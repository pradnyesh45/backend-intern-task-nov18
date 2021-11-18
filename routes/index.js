const express = require("express");

const router = express.Router();

const controller = require("../controller/index");

router.get("/", controller.home);

router.get("/getAllVideos", controller.getAllVideos);

router.post("/search", controller.search);

module.exports = router;
