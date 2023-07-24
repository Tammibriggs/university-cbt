import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "courses",
  initialState: {courses: []},
  reducers: {
    setCourses: (
      state,
      { payload }
    ) => {
      state.courses = payload
    }
  },
});

export const { setCourses } = slice.actions;

export default slice.reducer;

export const selectCourses = (state) => state.courses;