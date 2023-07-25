import {api} from './api'

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => 'users',
      providesTags: ['User']
    }),
    getResult: builder.query({
      query: (courseCode) => `result/${courseCode}`,
      providesTags: ['Result']
    }),
    getResults: builder.query({
      query: (courseCode) => `results/${courseCode}`,
    }),
    getUserById: builder.query({
      query: ({id}) => `users/${id}/user`,
      providesTags: ['User']
    }),
    getCourseStudents: builder.query({
      query: (courseCode) => `admin/get-course-students/${courseCode}`,
      providesTags: ['Students']
    }),
    generateCoursePasswords: builder.mutation({
      query: (courseCode) => ({
        url: 'admin/generate-course-passwords',
        method: 'POST',
        body: {
         courseCode
        }
      }),
    }),
    deleteCoursePasswords: builder.mutation({
      query: (courseCode) => ({
        url: 'admin/delete-course-passwords',
        method: 'DELETE',
        body: {
         courseCode
        }
      }),
    }),
    startExam: builder.mutation({
      query: ({studentId, courseCode}) => ({
        url: 'start-exam',
        method: 'POST',
        body: {
          studentId,
         courseCode
        }
      }),
    }),
    saveResult: builder.mutation({
      query: ({answers, courseCode}) => ({
        url: 'submit-result',
        method: 'POST',
        body: {
          answers,
         courseCode
        }
      }),
    })
  }), 
  overrideExisting: false,
})

export const { 
  useGetUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useGetCourseStudentsQuery,
  useGenerateCoursePasswordsMutation,
  useDeleteCoursePasswordsMutation,
  useStartExamMutation,
  useSaveResultMutation,
  useGetResultQuery,
  useGetResultsQuery
} = userApi