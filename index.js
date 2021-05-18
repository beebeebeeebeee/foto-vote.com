require("dotenv").config();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.io = io;

app.set('view engine', 'ejs');

// Set some defaults (required if your JSON file is empty)
db.defaults({ posts: [], account: [] }).write();

app.use(cookieParser());
//bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//static part
app.use("/static/", express.static("public/main"));
app.use("/static/hash", express.static("public/hash"));
app.use("/global", express.static("public/global"));

//ejs part
app.use("/", require("./router/ejs/main"));
app.use("/", require("./router/ejs/hash"));

//api part
app.use("/api/upload", require("./router/upload"));
app.use("/api/vote", require("./router/vote"));
app.use("/api/user", require("./router/auth/auth"));
app.use("/api/profile", require("./router/user"));

app.get("/api/data/:hash", (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  data = db.get("posts").find({ id: req.params.hash }).value();
  res.status(200).send(data);
});


server.listen(port, () => {
  console.log(`express is listening on http://localhost:${port}/`);
});
