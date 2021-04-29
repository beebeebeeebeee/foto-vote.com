const express = require("express");
const router = express.Router();
const verifyTokenInvert = require("./auth/verifyTokenInvert");
const sharp = require("sharp");
var fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const COOKIE_TIME = 3600000 * 24 * 30 * 12;

//create temp and images folder
var createFolder = require("./function/createFolder");
createFolder("./public/hash/temp");
createFolder("./public/main/icon");

//multer
var upload = require("./function/uploadMulter");

router.post(
  "/icon",
  verifyTokenInvert,
  upload.single("icon"),
  async (req, res) => {
    await sharp(`./public/hash/temp/${req.file.filename}`, {
      failOnError: false,
    })
      .resize(200, 200)
      .jpeg({ quality: 50 })
      .withMetadata()
      .toFile(`./public/main/icon/${req.file.filename}`);

    fs.unlinkSync(`./public/hash/temp/${req.file.filename}`);

    const adapter = new FileSync("db.json");
    const db = low(adapter);

    db.get("account")
      .find({ id: req.user_id })
      .assign({ icon: req.file.filename })
      .write();

    res.status(200).send({ body: "OK!" });
  }
);

router.post("/name", verifyTokenInvert, (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  db.get("account")
    .find({ id: req.user_id })
    .assign({ name: req.body.data })
    .write();
  res.cookie("name", req.body.data, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });
  res.status(200).send({ body: "OK!" });
});

router.post("/title", verifyTokenInvert, (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  db.get("account")
    .find({ id: req.user_id })
    .assign({ title: req.body.data })
    .write();
  res.status(200).send({ body: "OK!" });
});

router.post("/bio", verifyTokenInvert, (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  db.get("account")
    .find({ id: req.user_id })
    .assign({ bio: req.body.data })
    .write();
  res.status(200).send({ body: "OK!" });
});

module.exports = router;
