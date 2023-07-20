const CourseDetail = require("../models/CourseDetail")

const getCourseCodes = async () => {
  try {
    let courseCodes = []
    const courseDetails = await CourseDetail.find()
    courseDetails.forEach((courseDetail) => {
      courseCodes = [...courseCodes, ...courseDetail.courses]
    })
    return courseCodes
  }catch (err) {
    return null
  }
}

module.exports = {getCourseCodes}