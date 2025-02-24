import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    socketId: null,  // Store the socket ID instead
    onlineUsers: [],
};

export const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload;
        },
        addOnlineUser: (state, action) => {
            state.onlineUsers.push(action.payload);
        },
        removeOnlineUser: (state, action) => {
            state.onlineUsers = state.onlineUsers.filter(id => id !== action.payload);
        },
        setSocket: (state, action) => {
            state.socketId = action.payload;  // Store the socket ID instead of the full socket object
        },
    },
});

export const { addOnlineUser, removeOnlineUser, setOnlineUsers, setSocket } = socketSlice.actions;

export default socketSlice.reducer;
