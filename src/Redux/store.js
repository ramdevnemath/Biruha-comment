import { configureStore } from "@reduxjs/toolkit"
import postSlice from "./Slices/postSlice"
import commentSlice from "./Slices/commentSlice"
import replySlice from "./Slices/replySlice"

const  store = configureStore({
    reducer: {
        posts:postSlice,
        comments:commentSlice,
        replies:replySlice
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware(),
    devTools: true
})

export default store