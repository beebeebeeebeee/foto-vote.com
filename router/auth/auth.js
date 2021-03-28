const router = require("express").Router();
const verified = require("./verifyToken");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const {
  registerValidation,
  loginValidation,
} = require("./function/validation");

const { getOne, register, getData } = require("./function/access");
const { json } = require("express");

const COOKIE_TIME = 3600000 * 24 * 30 * 12;

router.post("/register", async (req, res) => {
  let body = req.body;
  const { error } = registerValidation(body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await getOne(body.account);
  console.log(user);
  if (user) return res.status(400).send("account already exist!");

  const salt = await bcrypt.genSalt(10);
  body.password = await bcrypt.hash(body.password, salt);
  body.id = uuid.v4();

  console.log(body.id);

  await register(body);

  const token = jwt.sign({ id: body.id }, process.env.TOKEN_SECRET || "123456");
  res.cookie("auth-token", token, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });
  res.cookie("name", body.name, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });
  res.cookie("id", body.id, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });

  return res.status(200).send("OK");
});

router.post("/login", verified, async (req, res) => {
  let body = req.body;

  const { error } = loginValidation(body);
  if (error) return res.status(400).send({ body: error.details[0].message });

  const user = await getOne(body.account);
  if (!user) return res.status(400).send({ body: "account incorrect!" });

  const validPass = await bcrypt.compare(body.password, user.password);
  if (!validPass) return res.status(400).send({ body: "password incorrect!" });

  const token = jwt.sign({ id: user.id }, process.env.TOKEN_SECRET);
  res.cookie("auth-token", token, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });
  res.cookie("name", user.name, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });
  res.cookie("id", user.id, {
    expires: new Date(Date.now() + COOKIE_TIME),
    secure: false,
  });

  return res.status(200).send({ body: "OK" });
});

router.post("/logout", async (req, res) => {
  res.cookie("auth-token", "", { expires: new Date(0) });
  res.cookie("name", "", { expires: new Date(0) });
  res.cookie("id", "", { expires: new Date(0) });
  res.status(200).send();
});

router.post("/data", async (req, res) => {
  const token = req.cookies["auth-token"];
  console.log(token);
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await getData(verified.id);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(400).send();
  }
});

module.exports = router;
