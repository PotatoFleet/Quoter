const mongoose = require("mongoose");
const User = require("./models/User");
const Quote = require("./models/Quote");
const express = require("express");
const router = express.Router();
const cors = require("cors");

router.use(cors());

let gsession;

router.get("/quotes", (req, res) => {
  if ("seen" in req.query) {
    Quote.find({
      quote: {
        $nin: req.query.seen
          .split('"')
          .filter((item) => item.length > 0 && item !== ", "),
      },
    }).then((data) => {
      let quotes = [];
      for (let i = 0; i < 3 && data.length > 0; i++) {
        let idx = Math.floor(Math.random() * data.length);
        quotes.push(data[idx]);
        data.splice(idx, 1);
      }
      res.send(quotes);
    });
  } else Quote.find({}).then((data) => res.send(data));
});

router.get("/logged-in", (_req, res) => {
  if (!gsession) {
    res.send(false);
    return;
  }

  if (gsession.user) {
    res.send(true);
  } else {
    res.send(false);
  }
});

router.post("/like", async (req, _res) => {
  const user = await User.findOne({ username: gsession.user });
  const quote = await Quote.findOne({ quote: req.body.quote });
  if (req.body.sign === 1) {
    quote.likes++;
    user.likedQuotes.push(quote);
  } else {
    quote.likes--;
    user.likedQuotes.pull({ _id: new mongoose.Types.ObjectId(quote._id) });
  }
  quote.save();
  user.save();
});

router.get("/liked", async (req, res) => {
  if (!gsession || !gsession.user) res.send(false);
  else {
    const user = await User.findOne({ username: gsession.user });
    res.send(
      user.likedQuotes.includes(new mongoose.Types.ObjectId(req.query.quoteId))
    );
  }
});

router.post("/user-found", async (req, res) => {
  let user;

  if (req.body.password) {
    user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });
  } else {
    user = await User.findOne({ username: req.body.username });
  }

  if (user === null) res.send(false);
  else res.send(true);
});

router.post("/login", (req, res) => {
  req.session.user = req.body.username;
  req.session.save();
  gsession = req.session;
  res.send(true);
});

router.post("/register", async (req, res) => {
  await new User({
    username: req.body.username,
    password: req.body.password,
  }).save();
  res.send(true);
});

router.post("/post-quote", async (req, res) => {
  const user = await User.findOne({ username: gsession.user });
  await new Quote({
    userId: user._id,
    quote: req.body.quote,
    author: req.body.author,
    likes: 0,
  }).save();
});

module.exports = router;
