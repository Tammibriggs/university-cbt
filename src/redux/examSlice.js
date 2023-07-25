import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "exam",
  initialState: {
    currentIndex: 0,
    answers: [],
    answeredQuestions: [],
    result: null
  },
  reducers: {
    nextQuestion: ( state ) => {
      state.currentIndex = state.currentIndex + 1
    },
    prevQuestion: ( state ) => {
      state.currentIndex = state.currentIndex - 1
    },
    skipQuestion: ( state, {payload} ) => {
      state.currentIndex = payload
    },
    setAnswer: (state, {payload: {questionId, option, index}}) => {
      const newAnswer = state.answers
      const answerIndex = newAnswer.findIndex(answer => answer.questionId === questionId)
      if(answerIndex < 0) {
        state.answers = [...state.answers, {questionId, option}]
        state.answeredQuestions = [...state.answeredQuestions, index]
      }else {
        newAnswer[answerIndex].option = option

      }
    },
    setAnswers: (state, {payload}) => {
      state.answers = payload
    },
    clearExamState: (state) => {
      state.currentIndex = 0
      state.answers = []
      state.answeredQuestions = []
      state.result = null
    }
  },
});

export const { 
  nextQuestion, 
  prevQuestion, 
  skipQuestion,
  setAnswer,
  setAnswers,
  clearExamState
} = slice.actions;

export default slice.reducer;