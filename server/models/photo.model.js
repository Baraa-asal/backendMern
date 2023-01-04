const mongoose = require("mongoose");

const PhotoSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports.Photo = mongoose.model("Photo", PhotoSchema);
