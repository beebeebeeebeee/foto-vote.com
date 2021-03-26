const mkdirp = require("mkdirp");
var multer = require("multer");
const path = require("path");

var storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    cb(null, "./public/hash/temp");
  },
  filename: function (_req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

module.exports = multer({ storage: storage });
