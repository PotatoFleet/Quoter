const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  userId: mongoose.Schema.ObjectId,
  quote: String,
  author: String,
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Quote", quoteSchema);
