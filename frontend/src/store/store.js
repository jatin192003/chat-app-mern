import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice"
import chatReducer from "./slice/ChatSlice"
import socketReducer from "./slice/socketSlice"
import messagesReducer from "./slice/messageSlice"
import { setupInterceptors } from "../utils/axiosInstance";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        chat: chatReducer,
        messages : messagesReducer,
        socket: socketReducer,
    },
});

setupInterceptors(store);