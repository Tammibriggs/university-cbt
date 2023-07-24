import {api} from './api'

const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: () => 'users',
      providesTags: ['User']
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
  useDeleteCoursePasswordsMutation
} = userApi