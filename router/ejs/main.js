const express = require("express");
const router = express.Router();
const disk = require('diskusage')

router.get("/", async function (req, res) {
  let info = await disk.checkSync("/");
  res.render("./main/index", {storage: `${formatBytes(info.free)}/${formatBytes(info.total)}`});
});

router.get("/login", function (req, res) {
  res.render("./main/login", {});
});

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

module.exports = router;
