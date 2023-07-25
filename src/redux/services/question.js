import {api} from './api'

const questionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addQuestions: builder.mutation({
      query: (({courseId, questions}) => ({
        url: 'admin/add-questions',
        method: 'POST',
        body: {
         courseId,
         questions
        }
      }))
    }),
    getAdminQuestions: builder.query({
      query: (courseId) => `admin/questions/${courseId}`,
    }),
    getQuestions: builder.query({
      query: (courseId) => `questions/${courseId}`,
    })
  }),
  overrideExisting: false,
})

export const { 
  useAddQuestionsMutation, 
  useGetAdminQuestionsQuery,
  useGetQuestionsQuery
} = questionApi