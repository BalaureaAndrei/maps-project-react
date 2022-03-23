import { configureStore } from "@reduxjs/toolkit";
import filterSlice from "./filter-slice";
import mapPositionSlice from "./map-slice";
import loginSlice from "./login-slice";

const store = configureStore({
  reducer: {
    mapPositionSlice: mapPositionSlice.reducer,
    filterSlice: filterSlice.reducer,
    loginSlice: loginSlice.reducer,
  },
});

export default store;
