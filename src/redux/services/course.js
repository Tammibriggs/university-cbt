import {api} from './api'

const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourseCodes: builder.query({
      query: () => 'get-course-codes',
    }),
  }),
  overrideExisting: false,
})

export const { useGetCourseCodesQuery } = courseApi