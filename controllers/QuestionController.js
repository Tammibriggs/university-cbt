const CourseService = require("../services/CourseService");
const QuestionService = require("../services/QuestionService");
const { shuffle } = require("../utils/utils");

const addQuestions = async (req, res, next) => {
  const { courseId, questions } = req.body;

  try {
    const formatData = await QuestionService.processFormData(courseId, questions);
    const createQuestion = await QuestionService.createQuestion(courseId, formatData);

    return res.status(201).send({ questions: createQuestion });
  } catch (err) {
    res.status(500).send("A server error occurred while creating questions.");
  }
}
const getQuestions = async (req, res, next) => {
  const { id } = req.body;
  try {
    const course = await CourseService.getCourseById(id);
    const questions = await QuestionService.getQuestions(id);
    if (!questions.length) {
      return res
        .status(404)
        .send({ err: "No question available at the moment." });
    }
    const shuffledQuestions = shuffle(questions)

    return res.status(200).send({ questions: shuffledQuestions, courseCode: course?.code});
  } catch (err) {
    return res
      .status(500)
      .send({ err: "A server error occurred while fetching questions." });
  }
}

const adminGetQuestions = async (req, res) => {
  const courseId = req.params.courseId;

  try {
    const course = await CourseService.getCourseById(courseId);
    const questions = await QuestionService.adminGetQuestions(courseId);

    return res.status(200).send({ questions, course});
    
  }catch (err) {
    return res.status(500).send({ code:'internal-error', message: "A server error occurred while trying to fetching questions" });
  }
}

module.exports = {addQuestions, getQuestions, adminGetQuestions}