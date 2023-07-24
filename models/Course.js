const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseSchema = new Schema({
  year: {
    type: Number,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  isAvailable: {
    type: Boolean,
    default: false,
  },
  completeTime: {
    type: Number,
    default: 60 * 60 * 1000
  },
  endingTime: {
    type: Number,
    default: 0
  },
  written: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Course", CourseSchema);