import { createSlice } from "@reduxjs/toolkit";

const filterSlice = createSlice({
  name: "filterSlice",
  initialState: { appliedFilter: null },
  reducers: {
    setFilter(state, action) {
      state.appliedFilter = action.payload;
    },
  },
});

export const filterSliceActions = filterSlice.actions;

export default filterSlice;
