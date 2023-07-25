const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Schema } = mongoose;

const StudentSchema = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  matNo: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    unique: true
  },
  passwords: {
    type: {},
  },
  registeredCourses: {
    type: Array, 
  },
  startCourse: {
    type: {
      course: String,
      endingTime: Number
    },
  },
  writtenCourse: {
    type: Array,
  }
});

// Salting and Hashing the user password with bcrypt
StudentSchema.methods.hashStudentPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log("Unable to hash password " + err);
    throw err;
  }
};

// Generating and signing the user token                                   
StudentSchema.methods.generateToken = async function () {
  try {
    const payload = {
      id: this._id,
      isAdmin: false,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("Student", StudentSchema);
