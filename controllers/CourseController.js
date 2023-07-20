const CourseService = require("../services/CourseService")

const getCourseCodes = async (req, res) => {
  try {
    const courseCodes = await CourseService.getCourseCodes()
    res.status(200).send(courseCodes)
  }catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while fetching course codes" });
  }
}

module.exports = {
  getCourseCodes
}