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
  }), 
  overrideExisting: false,
})

export const { 
  useGetUserQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = userApi