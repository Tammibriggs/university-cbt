import {api} from './api'

const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (({matNo, password, courseCode}) => ({
        url: 'login',
        method: 'POST',
        body: {
          matNo,
          password,
          courseCode
        }
      }))
    }),
    adminLogin: builder.mutation({
      query: (({username, password}) => ({
        url: 'admin/login',
        method: 'POST',
        body: {
          username,
          password
        }
      }))
    })
  }),
  overrideExisting: false,
})

export const { useLoginMutation, useAdminLoginMutation } = authApi