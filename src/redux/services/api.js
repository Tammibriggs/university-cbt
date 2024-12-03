import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { parseJwt } from '../../utils'
import { setCredentials } from '../authSlice'

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.REACT_APP_SEVER_BASE_URL}/api/`,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token
     
      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
    fetchFn: async (info, init) => {
      const token = sessionStorage.getItem("token")
      if (token) {
        const decodedJwt = parseJwt(token);
        if (decodedJwt.exp * 1000 < Date.now()) {
          sessionStorage.clear();
          decodedJwt.isAdmin ? document.location.href = '/admin' : document.location.href = '/'
        }
      }
      return fetch(info, init)
    },

  }),
  tagTypes: ['User', 'Courses'],
  endpoints: () => ({})
})