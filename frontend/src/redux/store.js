import { configureStore } from "@reduxjs/toolkit";
import todoAppReducer from "./profileSlice";

export const store = configureStore({
    reducer: {
        todoApp: todoAppReducer,
    },
})