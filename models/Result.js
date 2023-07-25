const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResultSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  courseCode: {
    type: String,
    required: true,
  },
  correctAnswers: {
    type: Number
  }
});

module.exports = mongoose.model("Result", ResultSchema);