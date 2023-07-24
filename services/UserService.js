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

const getStudentsOfACourse = async (courseCode) => {
  try{
    const students = await Student.find({registeredCourses: {$in: courseCode}})
    return students
  }catch (err) {
    return null;
  }
} 

const generateCoursePasswords = async (courseCode) => {
  try {
    const students = await Student.find({registeredCourses: {$in: courseCode}})
    await Promise.all(students.map(async (student) => {
      const field = 'passwords.' + courseCode.substring(0 , (courseCode.length - 2))
      await Student.updateOne({_id: student._id}, {$set: {[field] : Math.random().toString(36).substring(2, 9)}})
      return
    }))
    return true
  }catch (err) {
    return null;
  }
}

const deleteCoursePasswords = async (courseCode) => {
  try {
    const students = await Student.find({registeredCourses: {$in: courseCode}})
    await Promise.all(students.map(async (student) => {
      const field = 'passwords.' + courseCode.substring(0 , (courseCode.length - 2))
      await Student.updateOne({_id: student._id}, {$unset: {[field] : ""}})
    }))
    return true
  }catch (err) {
    return null;
  }
}

module.exports = {
  findUserByParams, 
  doesPasswordMatch, 
  findAdminByParams,
  getStudentsOfACourse,
  generateCoursePasswords,
  deleteCoursePasswords,
}