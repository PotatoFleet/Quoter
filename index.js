const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const api = require("./api");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 80;

mongoose.connect(process.env.DB_URL);
app.use(
  session({ resave: true, secret: "valorantvishal", saveUninitialized: true })
);
app.use(cors());
app.use(function (_req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api", api);
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server Listening on Port ${PORT}`);
});
