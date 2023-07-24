const UserService = require('../services/UserService')

const getStudentsOfACourse = async (req, res) => {
  const {courseCode} = req.params
  try {
    const student = await UserService.getStudentsOfACourse(courseCode)
    res.status(200).send(student)
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to fetching students" });
  }
}

const generateCoursePasswords = async (req, res) => {
  const {courseCode} = req.body
  try {
    await UserService.generateCoursePasswords(courseCode)
    res.status(200).send('Successfully generated course passwords')
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to generate students password" });
  }
}

const deleteCoursePasswords = async (req, res) => {
  const {courseCode} = req.body
  try {
    await UserService.deleteCoursePasswords(courseCode)
    res.status(200).send('Successfully deleted course passwords')
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to delete students password" });
  }
}

module.exports = {
  getStudentsOfACourse,
  generateCoursePasswords,
  deleteCoursePasswords
}