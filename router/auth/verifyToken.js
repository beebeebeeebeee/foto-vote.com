const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies["auth-token"];
  if (!token) return next();

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    return res.status(200).send({ body: "already logged in!" });
  } catch (err) {
    return next();
  }
};
