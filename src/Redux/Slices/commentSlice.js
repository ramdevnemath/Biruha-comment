import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('comments') ? JSON.parse(localStorage.getItem('commenst')) : null;

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        setCommentSlice:  (state, action) => {
            localStorage.setItem("comments", JSON.stringify(action.payload))
            return action.payload
        },
        dropCommentSlice: (state) => {
            localStorage.removeItem('comments')
            return null
        }
    }
})

export const { setCommentSlice, dropCommentSlice } = commentSlice.actions
export default commentSlice.reducer