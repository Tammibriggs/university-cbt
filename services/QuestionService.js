const Question = require("../models/Question");
const Course = require("../models/Course");

const processFormData = async (courseId, questions) => {
  const formatData = questions.map((item) => ({
    courseId,
    question: item.question,
    answer: item.answer.toLowerCase(),
    options: [
      { a: item.optionA },
      { b: item.optionB },
      { c: item.optionC },
      { d: item.optionD },
    ],
  }));
  return await formatData;
}

const createQuestion = async (courseId, data) => {
  try {
    const course = await Course.findById(courseId);

    const savedQuestions = await Promise.all(data.map(async (question) => {
      const questionDB = await new Question(question).save();
      course.questions = [...course.questions, questionDB._id];
      return questionDB
    }))

    await course.save()
    return await savedQuestions;
  } catch (err) {
    console.log(err);
    return null;
  }
}

const adminGetQuestions = async (courseId) => {
  try {
    const questions = await Question.find({ courseId })
    return questions;
  } catch (err) {
    console.log(err);
    return null;
  }
}

module.exports = {processFormData, createQuestion, adminGetQuestions}