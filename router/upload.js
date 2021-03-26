const express = require("express");
const router = express.Router();
const getToken = require("./function/getToken");
const sharp = require("sharp");
var fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

// Set some defaults (required if your JSON file is empty)
db.defaults({ posts: [] }).write();

/////////////////////////////////
//file uploader
/////////////////////////////////
var createFolder = require("./function/createFolder");
createFolder("./public/hash/temp");
createFolder("./public/hash/images");

var upload = require("./function/uploadMulter");
const e = require("express");
/////////////////////////////////
//end of file uploader
/////////////////////////////////

router.post("/", upload.array("files", 200), async (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  hash = "";
  while (true) {
    hash = await getToken(6);
    if (!db.get("posts").find({ id: hash }).value()) break;
  }

  form_name = req.body.name;
  form_title = req.body.Title;
  images = req.files.map(function (el) {
    return el.filename;
  });
  images.forEach(async (el) => {
    await sharp(`./public/hash/temp/${el}`, { failOnError: false })
      .jpeg({ quality: 80 })
      .withMetadata()
      .toFile(`./public/hash/images/${el}`);
    fs.unlinkSync(`./public/hash/temp/${el}`);
  });

  db.get("posts")
    .push({ id: hash, name: form_name, title: form_title, images: images, votes: [] })
    .write();

  res.status(200).send({ hash: hash });
});

module.exports = router;
