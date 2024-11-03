import { configureStore } from "@reduxjs/toolkit";
import weatherApiSliceReducer from "./weatherApiSlice";
export const store = configureStore({
  reducer: {
    weather: weatherApiSliceReducer,
  },
});
