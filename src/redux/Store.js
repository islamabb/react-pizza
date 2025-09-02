import { configureStore } from "@reduxjs/toolkit";
import filter from './slices/filterSlice.js'

export const store = configureStore({
  reducer: {
    filter,
  },
});