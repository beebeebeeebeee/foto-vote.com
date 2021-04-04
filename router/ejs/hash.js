const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

router.get("/:hash", function (req, res) {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  data = db.get("posts").find({ id: req.params.hash }).value();
  res.render("./hash/index", { title: data.title, hash: req.params.hash });
});

router.get("/:hash/result", function (req, res) {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  data = db.get("posts").find({ id: req.params.hash }).value();
  res.render("./hash/result", { title: data.title });
});

module.exports = router;
