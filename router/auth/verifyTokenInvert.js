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

    data = db.get("account").find({ id: req.user_id }).value();
    if (data) {
      next();
    } else {
      return res.status(403).send({ body: "no this user!" });
    }
  } catch (err) {
    return res.status(405).send({ body: err });
  }
};
