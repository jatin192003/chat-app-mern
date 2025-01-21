import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const API_URL = '/message/';

const initialState = {
    messages: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ""
}


export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (messageData, thunkAPI) => {
        try {
            const response = await axiosInstance.post(API_URL +'sendMessage', messageData);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Fetch all messages for a chat
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (chatId, thunkAPI) => {
        try {
            const response = await axiosInstance.get(API_URL +`allMessages/${chatId}`);
            return response.data;
        } catch (error) {
            const message = error.response?.data?.message || error.message || error.toString();
            toast.error(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const messagesSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state) => {
            state.isLoading = true;
        })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
})

export const { reset, addMessage, setMessages } = messagesSlice.actions
export default messagesSlice.reducer

