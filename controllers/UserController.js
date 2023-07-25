const UserService = require('../services/UserService')
const CourseService = require('../services/CourseService')
const Question = require('../models/Question')
const Result = require('../models/Result')
const Student = require('../models/Student')

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

const getResult = async (req, res) => {
  const {id} = req.user
  const {courseCode} = req.params
  try {
    const result = await Result.findOne({userId: id, courseCode})
    res.status(200).send(result)
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to get result" });
  }
}

const getResults = async (req, res) => {
  const {courseCode} = req.params
  try {
    const results = await Result.find({courseCode})
    res.status(200).send(results)
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to get results" });
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

const startExam = async (req, res) => {
  const {studentId, courseCode} = req.body
  try {
    const course = await CourseService.getCourseByCode(courseCode)
    if(!course || !course?.isAvailable) return res.status(409).send({code: 'unprocessable', message: 'This course is not available'})

    const user = await UserService.findUserByParams({_id: studentId})
    if(user.startCourse.course === courseCode) {
      if(user.startCourse?.endingTime) return res.status(304).send(user)
    }
    const updatedUser = await UserService.updateStudent(studentId, {$set: {"startCourse.endingTime": Date.now() + course.completeTime}})
    res.status(200).send(updatedUser)
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to start exam" });
  }
}

const saveStudentResult = async (req, res) => {
  const {id} = req.user
  const {answers, courseCode} = req.body
  let result = {}

  try {
    const student = await Student.findById(id)
    if(student.startCourse.course !== courseCode || !student.startCourse?.endingTime) return res.status(409).send({code: 'unprocessable', message: 'You need to start a course before submitting it'})

    const resultDB = await Result.findOne({userId: id, courseCode})
    if(resultDB) return res.status(403).send({code: 'not-allowed', message: 'You have already written this course'})

    const course = await CourseService.getCourseByCode(courseCode)
    const questions = await Question.find({courseId: course._id});
    result = {userId: id, courseCode: course.code, correctAnswers: 0}
    questions.forEach((question) => {
      answers.forEach(answer => {
        if(answer.questionId == question._id && question.answer.toLowerCase() === answer.option.toLowerCase()) {
          result.correctAnswers = result.correctAnswers + 1
        }
      })
    })
    await Student.updateOne({_id: id}, {$set: {"startCourse": {}}})
    const savedResult = await new Result(result).save();
    return res.status(200).send(savedResult)
  }catch(err) {
    console.log(err)
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to save result" });
  }
}

module.exports = {
  getStudentsOfACourse,
  generateCoursePasswords,
  deleteCoursePasswords,
  startExam,
  saveStudentResult,
  getResult,
  getResults
}