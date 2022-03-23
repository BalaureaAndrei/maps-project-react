import { createSlice } from "@reduxjs/toolkit";

const mapPositionSlice = createSlice({
  name: "mapPosition",
  initialState: { mapPosition: [-31.083332, 150.916672], setPost: null },
  reducers: {
    focus(state, action) {
      state.mapPosition = action.payload;
    },
    rerender(state, action) {
      state.setPost = action.payload;
    },
  },
});

export const mapActions = mapPositionSlice.actions;

export default mapPositionSlice;
