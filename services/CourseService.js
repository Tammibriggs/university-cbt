const CourseDetail = require("../models/CourseDetail")
const Course = require("../models/Course")

const getCourseCodes = async () => {
  try {
    let courseCodes = []
    const courseDetails = await CourseDetail.find()
    courseDetails.forEach((courseDetail) => {
      const newCourseDetail = courseDetail.courses.map((course => {
        const newCourse = {...course._doc}
        newCourse["year"] = courseDetail.year
        return newCourse
      }))
      courseCodes = [...courseCodes, ...newCourseDetail]
    })
    return courseCodes
  }catch (err) {
    return null
  }
}

const getCourseById = async (id) => {
  try {
    const courseFromDb = await Course.findById(id);
    return courseFromDb;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const getCourses = async () => {
  try {
    const courses = await Course.find()
    return courses
  }catch (err) {
    console.log(err);
    return null
  }
}

const addCourse = async function (data) {
  try {
    const saveCourse = await new Course(data).save();
    return saveCourse;
  } catch (err) {
    console.log(err);
    if(err.code === 11000) return {error: true, code: 'duplicate-document', message: 'You cannot add an already existing course'}
    return {error: true, code: 'unprocessable-request', message: 'Unable to add course'};
  }
}

const changeCourseStatus = async function (id) {
  try {
    const courseFromDb = await Course.findById(id)
    if(!courseFromDb.written) {
        if(!courseFromDb.isAvailable) {
        // Unpublish onging course and Set request-course endingTime and publish it  
        const onGoingCourse = await Course.findOne({isAvailable: true})
        if(onGoingCourse) {
          onGoingCourse.isAvailable = false
          onGoingCourse.endingTime = 0
          await onGoingCourse.save()
        }

        courseFromDb.endingTime = Date.now() + courseFromDb.completeTime
        courseFromDb.isAvailable = true;
      }else {
        // If has passed it ending time, set course as completed then unpublish else remove ending time then unpublish.
        if(courseFromDb.endingTime < Date.now()) {
          courseFromDb.isAvailable = false;
          courseFromDb.written = true
          courseFromDb.endingTime = 0
        }
        else courseFromDb.endingTime = 0
        courseFromDb.isAvailable = false;
      }
    }
    return await courseFromDb.save();
  } catch (err) {
    console.log(err);
    return null;
  }
}

const deleteById = async (id) => {
  try {
    await Course.deleteOne({_id: id});
    await Question.deleteMany({courseId: id});
    return true
  }catch (err){
    return null
  }
}

module.exports = {
  getCourseCodes, 
  addCourse, 
  getCourses,
  getCourseById,
  changeCourseStatus,
  deleteById
}