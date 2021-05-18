const express = require("express");
const app = express();
const router = express.Router();
const getToken = require("./function/getToken");
const sharp = require("sharp");
var fs = require("fs");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
var sizeOf = require("image-size");
const exif = require("./function/exif");



//create temp and images folder
var createFolder = require("./function/createFolder");
createFolder("./public/hash/temp");
createFolder("./public/hash/images");

//multer
var upload = require("./function/uploadMulter");

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
  form_id = req.body.user_id;
  images = req.files.map(function (el) {
    console.log(el);
    return { filename: el.filename, portrait: null };
  });

  req.app.io.emit('progress', 0);

  await asyncForEach(images, async (el, index) => {
  req.app.io.emit('progress', parseInt(index/images.length*100));
    await sharp(`./public/hash/temp/${el.filename}`, { failOnError: false })
      .jpeg({ quality: 30 })
      .withMetadata()
      .toFile(`./public/hash/images/${el.filename}`);
    var dimensions = sizeOf(`./public/hash/temp/${el.filename}`);
    images[index].portrait = dimensions.height > dimensions.width;
    fs.unlinkSync(`./public/hash/temp/${el.filename}`);

    if (isIphoneName(el.filename)) {
      try {
        data = await exif(`./public/hash/images/${el.filename}`);
        images[index].RawFilename = [
          data.data[0].RawFileName.split(".").slice(0, -1).join("."),
          el.filename.split(".").pop(),
        ].join(".");
      } catch (e) {
        console.log(
          "could not found RawFileName",
          el.filename,
          data.data[0].RawFileName
        );
      }
    }
  });

  db.get("posts")
    .push({
      id: hash,
      name: form_name,
      user_id: form_id,
      title: form_title,
      images: images,
      timestamp: new Date(),
      votes: [],
    })
    .write();

  res.status(200).send({ hash: hash });
});

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

function isIphoneName(name) {
  name = name.split("-").slice(1).join("-");
  return name.length - name.replace(/[A-Z0-9-]/g, "").length == 36;
}

module.exports = router;
