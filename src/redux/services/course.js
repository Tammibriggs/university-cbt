import {api} from './api'

const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseCodes: builder.query({
      query: () => 'get-course-codes',
    }),
    getCourseById: builder.query({
      query: (id) => `course/${id}`,
    }),
    getCourseByCode: builder.query({
      query: (courseCode) => `course/code/${courseCode}`,
    }),
    getCourses: builder.query({
      query: () => `admin/courses`,
      providesTags: ['Courses']
    }),
    addCourse: builder.mutation({
      query: (({title, courseCode, year}) => ({
        url: 'admin/add-course',
        method: 'POST',
        body: {
          title,
          year,
          courseCode
        }
      }))
    }),
    changeCourseStatus: builder.mutation({
      query: (courseId, currentStatus) => ({
        url: 'admin/course/status',
        method: 'POST',
        body: {
          courseId
        }
      }),
      invalidatesTags: ['Courses']
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: 'admin/delete-course',
        method: 'DELETE',
        body: {
          courseId
        }
      }),
      invalidatesTags: ['Courses']
    })
  }),
  overrideExisting: false,
})

export const { 
  useGetCourseCodesQuery, 
  useGetCoursesQuery, 
  useAddCourseMutation, 
  useGetCourseByIdQuery,
  useLazyGetCourseByIdQuery,
  useLazyGetCoursesQuery,
  useChangeCourseStatusMutation,
  useDeleteCourseMutation,
  useGetCourseByCodeQuery,
} = courseApi