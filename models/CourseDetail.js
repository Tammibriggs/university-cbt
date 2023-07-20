const mongoose = require("mongoose");
const { Schema } = mongoose;

const CourseDetailSchema = new Schema({
  year: {
    type: Number,
    required: true,
  },
  courses: {
    type: [
      {
        title: String,
        code: String
      }
    ]
  }
});

module.exports = mongoose.model("CourseDetail", CourseDetailSchema);
