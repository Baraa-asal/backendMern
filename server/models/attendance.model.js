const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    status: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", AttendanceSchema);
