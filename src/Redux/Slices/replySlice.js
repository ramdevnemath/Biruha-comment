import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('replies') ? JSON.parse(localStorage.getItem('replies')) : null;

const replySlice = createSlice({
    name: 'replies',
    initialState,
    reducers: {
        setReplySlice:  (state, action) => {
            localStorage.setItem("replies", JSON.stringify(action.payload))
            return action.payload
        },
        dropReplySlice: (state) => {
            localStorage.removeItem('replies')
            return null
        }
    }
})

export const { setReplySlice, dropReplySlice } = replySlice.actions
export default replySlice.reducer