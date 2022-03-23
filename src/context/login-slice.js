import { createSlice } from "@reduxjs/toolkit";

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: {
    isLoggedIn: false,
    userData: null,
    userBookmarks: [0],
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
      state.userBookmarks = [];
    },
    setBookmarks(state, action) {
      state.userBookmarks = action.payload;
    },
  },
});

export const loginSliceActions = loginSlice.actions;
export default loginSlice;
