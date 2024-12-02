const admin = require("../data/admin.json");
const Admin = require("../models/Admin");
const courseDetails = require("../data/courseDetails.json");
const CourseDetail = require("../models/CourseDetail");
const students = require("../data/students.json");
const Student = require("../models/Student");

const populateDbWithAdmin = async () => {
  try {
    // Delete existing documents
    await Admin.deleteMany()

    // Populate with collection with data
    await Promise.all(admin.map(async (user) => {
      user.password = await Admin.hashAdminPassword(user.password);
        const adminToCreate = new Admin(user);
        await adminToCreate.save();
        console.log('Admin successfully created')
    }))
  } catch (err) {
    console.log("An error occurred while populating admin " + err);
    return null;
  }
}

const populateDBWithCourseDetails =  async () => {
  // const promise = new Promise((resolve, reject) => {
  //   courseDetails.forEach(async (course, index) => {
  //     try {
  //       const courseToCreate = new CourseDetail(course);
  //       const createdCourse = await courseToCreate.save();
  //     } catch (err) {
  //       reject(err);
  //     }
  //   });
  // });
  try {
    // Delete existing documents
    await CourseDetail.deleteMany()

    // Populate with collection with data
    await Promise.all(courseDetails.map(async (course) => {
      const courseToCreate = new CourseDetail(course);
      await courseToCreate.save();
    }))
    console.log('Successfully added course details')
    // return await promise;
  } catch (err) {
    console.log("An error occurred while adding course details" + err);
    return null;
  }
}

const populateDBWithStudents = async () => {
  try {
    // Delete existing documents
    await Student.deleteMany()
    console.log("Deleted existing student documents");


    // Populate with collection with data
    await Promise.all(students.map(async student => {
      const studentToCreate = new Student(student);
      const createdstudent = await studentToCreate.save();
    }))
    console.log("Successfully seeded student");
  }catch (err) {
    console.log(err);
    return null;  
  }
}

module.exports = {
  populateDBWithStudents,
  populateDbWithAdmin,
  populateDBWithCourseDetails,
}