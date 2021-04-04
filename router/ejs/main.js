const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  res.render("./main/index", {});
});

router.get("/login", function (req, res) {
  res.render("./main/login", {});
});

module.exports = router;
