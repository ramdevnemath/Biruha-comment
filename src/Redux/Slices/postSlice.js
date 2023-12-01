import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('posts') ? JSON.parse(localStorage.getItem('posts')) : null;

const postSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        setPostSlice:  (state, action) => {
            localStorage.setItem("posts", JSON.stringify(action.payload))
            return action.payload
        },
        dropPostSlice: (state) => {
            localStorage.removeItem('posts')
            return null
        }
    }
})

export const { setPostSlice, dropPostSlice } = postSlice.actions
export default postSlice.reducer