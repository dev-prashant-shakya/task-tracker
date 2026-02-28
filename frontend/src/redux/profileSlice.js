import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isUpdateTodoModalOpen: false,
    isDeleteTodoModalOpen: false
}

const todoAppSlice = createSlice({
    name: 'todoApp',
    initialState,

    reducers: {
        openUpdateTodoModal(state, action) {
            state.isUpdateTodoModalOpen = action.payload;
        },
        openDeleteTodoModal(state, action) {
            state.isDeleteTodoModalOpen = action.payload;
        },
    }
});

export const { 
    openUpdateTodoModal,
    openDeleteTodoModal,
} = todoAppSlice.actions;

export default todoAppSlice.reducer;