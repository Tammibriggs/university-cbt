import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "auth",
  initialState: { user: null, token: null},
  reducers: {
    setCredentials: (
      state,
      { payload: { user, token} }
    ) => {
      state.user = user
      state.token = token
    },
    setUser: (
      state,
      { payload: { user } }
    ) => {
      state.user = user
    },
  },
});

export const { setCredentials, setUser } = slice.actions;

export default slice.reducer;

export const selectCurrentUser = (state) => state.auth.user;