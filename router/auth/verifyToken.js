const jwt = require("jsonwebtoken");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) return next();

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    this_user_id = verified.id;

    const adapter = new FileSync("db.json");
    const db = low(adapter);

    data = db.get("account").find({ id: this_user_id }).value();
    if (data) {
      return res.status(200).send({ body: "already logged in!" });
    } else {
      return next();
    }
  } catch (err) {
      return next();
  }
};
