const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  likedQuotes: {
    type: [mongoose.Types.ObjectId],
    default: []
  },
});

module.exports = mongoose.model("User", userSchema);
