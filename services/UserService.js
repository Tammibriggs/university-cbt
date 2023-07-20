const Admin = require("../models/Admin");
const Student = require("../models/Student");
const bcrypt = require("bcrypt");

const findUserByParams = async (params) => {
  try {
    const user = await Student.findOne(params);
    return user;
  } catch (err) {
    console.log(err);
  }
}

const findAdminByParams = async (params) => {
  try {
    const user = await Admin.findOne(params);
    return user;
  } catch (err) {
    console.log(err);
  }
} 

const doesPasswordMatch = async (userPassword, passwordFromDb) => {
  try {
    return await bcrypt.compare(userPassword, passwordFromDb);
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {findUserByParams, doesPasswordMatch, findAdminByParams}