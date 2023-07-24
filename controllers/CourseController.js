const CourseService = require("../services/CourseService")

const getCourseCodes = async (req, res) => {
  try {
    const courseCodes = await CourseService.getCourseCodes()
    res.status(200).send(courseCodes)
  }catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while fetching course codes" });
  }
}

const getCourseById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const course = await CourseService.getCourseById(id);
    return res.status(200).send(course);
  } catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to add a course" });
  }
}

const getCourses = async (req, res) => {
  try {
    const courses = await CourseService.getCourses()
    return res.status(200).send(courses)
  }catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while fetching courses" });
  }
}

const addCourse = async (req, res, next) => {
  const { courseCode, title, year } = req.body;
  if (!courseCode || !title || !year) {
    return res.status(400).send({ code: 'missing-field', message: "One or more fields is empty" });
  }

  try {
    const addedCourse = await CourseService.addCourse({
      code: courseCode.trim(),
      title: title.trim(),
      year
    });
    if(addedCourse?.error) return res.status(400).send({code: addedCourse.code, message: addedCourse.message})
    return res.status(200).send({ course: addedCourse });
  } catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to add a course" });
  }
}

const changeCourseStatus = async (req, res) => {
  const { courseId } = req.body;
  try {
    const course = await CourseService.changeCourseStatus(courseId);
    return res.status(200).send(course);
  } catch (error) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to change course status" });
  }
}

const deleteCourse = async (req, res) => {
  const { courseId } = req.body;
  try {
    const deletedCourse = await CourseService.deleteById(courseId);
    return res.status(200).send(deletedCourse);
  } catch (err) {
    res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to delete course" });
  }
}

module.exports = {
  getCourseCodes,
  addCourse,
  getCourses,
  getCourseById,
  changeCourseStatus,
  deleteCourse,
}