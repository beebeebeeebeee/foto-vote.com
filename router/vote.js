const express = require("express");
const router = express.Router();
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const verifyTokenPost = require("./auth/verifyTokenPost");


router.post("/:hash", (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  data = db.get("posts").find({ id: req.params.hash }).value();
  data.votes.push(req.body);
  db.get("posts").find({ id: req.params.hash }).assign(data).write();
  res.status(200).send(data);
});

router.get("/all", (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);
  res.status(200).send(
    db
      .get("posts")
      .value()
      .map((e) => {
        return {
          id: e.id,
          user_id: e.user_id,
          name: e.name,
          title: e.title,
          timestamp: e.timestamp,
        };
      })
      .reverse()
      .slice(0, 10)
  );
});

router.get("/:user_id", (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  const {password, ...user} = db.get("account").filter({ id: req.params.user_id }).value()[0];

  res.status(200).send({
    user: user,
    data: db
      .get("posts")
      .filter({ user_id: req.params.user_id })
      .value()
      .map((e) => {
        return { id: e.id, name: e.name, title: e.title };
      })
      .reverse(),
  });
});

router.get("/result/:hash", (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  sc_data = db.get("posts").find({ id: req.params.hash }).value();
  data = sc_data.votes;

  temp1 = [];
  data.forEach((element) => {
    element.forEach((temp2) => {
      if (
        temp1.find((x) => {
          return x.element == temp2.element;
        })
      ) {
        index = temp1
          .map((m) => {
            return m.element;
          })
          .indexOf(temp2.element);
        temp1[index].vote.push(temp2.vote);
        temp1[index].vote_ab[temp2.vote]++;
        temp2.comment == null || temp2.comment.trim() == ""
          ? null
          : temp1[index].comment.push(temp2.comment);
      } else {
        temp1.push({
          element: temp2.element,
          vote: [temp2.vote],
          vote_ab: {
            like: temp2.vote == "like" ? 1 : 0,
            ok: temp2.vote == "ok" ? 1 : 0,
            dislike: temp2.vote == "dislike" ? 1 : 0,
            shit: temp2.vote == "shit" ? 1 : 0,
          },
          comment:
            temp2.comment == null || temp2.comment.trim() == ""
              ? []
              : [temp2.comment],
          marks: 0,
          length: 0,
        });
      }
    });
  });

  _index_marks = ["shit", "dislike", "ok", "like"];
  temp1.forEach((k, i) => {
    this_mk = 0;
    k.vote.forEach((n) => {
      this_mk += _index_marks.indexOf(n);
    });
    temp1[i].length = k.vote.length;
    temp1[i].marks = this_mk;
  });

  temp1.sort(function (a, b) {
    return b.marks - a.marks;
  });

  res
    .status(200)
    .send({ title: sc_data.title, name: sc_data.name, data: temp1 });
});

router.get("/delete/:hash", verifyTokenPost, (req, res) => {
  const adapter = new FileSync("db.json");
  const db = low(adapter);

  db.get("posts").remove({ id: req.params.hash }).write();
  res.status(200).send({ body: "OK!" });
});

module.exports = router;
