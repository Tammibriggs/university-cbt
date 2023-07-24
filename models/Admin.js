const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Schema } = mongoose;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
  }
});

AdminSchema.statics.hashAdminPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(5);
    return await bcrypt.hash(password, salt);
  } catch (err) {
    console.log("Unable to hash password" + err);
    throw err;
  }
};

// Generating and signing the user token                                   
AdminSchema.methods.generateToken = async function () {
  try {
    const payload = {
      id: this._id,
      isAdmin: true,
    };
    const token = await jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("Admin", AdminSchema);
