const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) res.status(401).send({ body: "Unauthorized" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user_id = verified.id;

    const adapter = new FileSync("db.json");
    const db = low(adapter);

    data = db.get("posts").find({ id: req.params.hash }).value();
    if (req.user_id == (data ? data.user_id : false)) {
      next();
    } else {
      return res.status(400).send({ body: "user id not correct!" });
    }
  } catch (err) {
    return res.status(400).send({ body: err });
  }
};
