// var ExifImage = require('exif');
const exiftool = require("node-exiftool");
const ep = new exiftool.ExiftoolProcess();

module.exports = function exif(path) {
  return new Promise((resolve, reject) => {
    ep.open()
      .then(() => ep.readMetadata(path, ["-File:all"]))
      .then((data,err)=>{
          if(err) reject(err)
          resolve(data)
      })
      .then(() => ep.close())
      .catch(err=>{reject(err)});
  });
};
