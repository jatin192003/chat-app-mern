import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const API_URL = '/chat/';

const initialState = {
    chats: [],
    selectedChat: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}

export const fetchChats = createAsyncThunk('chat/fetchChats', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.get(API_URL + 'fetchChats');
        return response.data;


    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        toast.error(message)
        return thunkAPI.rejectWithValue(message);
    }
})

export const accessChat = createAsyncThunk('chat/acessChat', async (userId, thunkAPI) => {
    try {
        const response = await axiosInstance.post(API_URL + 'accessChat', { userId });
        return response.data
    } catch (error) {
        const message = error.response?.data?.message || error.message || error.toString();
        toast.error(message)
        return thunkAPI.rejectWithValue(message);
    }
})

export const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setSelectedChat: (state, action) => {
            state.selectedChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchChats.pending, (state, action) => {
            state.isLoading = true;
        })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.chats = action.payload;
                toast.success("message fetched")
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;

            })
            .addCase(accessChat.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(accessChat.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const existingChatIndex = state.chats.findIndex(
                    (chat) => chat._id === action.payload._id
                );

                if (existingChatIndex === -1) {
                    state.chats.unshift(action.payload);
                }

                state.selectedChat = action.payload;
            })
            .addCase(accessChat.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
})

export const { reset, setSelectedChat } = chatSlice.actions
export default chatSlice.reducer

