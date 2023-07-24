const mongoose = require("mongoose");
const { Schema } = mongoose;

const StartedCourseSchema = new Schema({
  studendId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  courses: {
    type: String,
    required: true,
  },
  endTime: {
    type: Number,
    required: true,
  }
});

module.exports = mongoose.model("StartedCourseSchema", StartedCourseSchema);
