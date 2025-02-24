import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";


const user = JSON.parse(localStorage.getItem('user'));
const API_URL = '/user/';

const initialState = {
  user: user ? user : null,
  otherUser: [],
  accessToken: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'login', userData);
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.loggedInUser));
    }
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    toast.error(message)
    return thunkAPI.rejectWithValue(message);
  }
})

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const response = await axiosInstance.post(API_URL + 'register', userData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    toast.error(message)
    return thunkAPI.rejectWithValue(message);
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await axiosInstance.get(API_URL + 'logout');
  localStorage.removeItem('user');
})

export const getUser = createAsyncThunk('auth/getuser', async () => {
  const response = await axiosInstance.get(API_URL + 'getuser');
  return response.data
});

export const getOtherUser = createAsyncThunk('auth/getOtherUser', async (query) => {
  const response = await axiosInstance.get(API_URL + `?search=${query}`);
  return response.data;
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.otherUser = [];
      state.message = '';
    },
    setCredentials: (state, action) => {
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        toast.success(action.payload.message)
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.loggedInUser;
        toast.success(action.payload.message)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      .addCase(getOtherUser.pending, (state, action) => {
        state.isLoading = true
      })
      .addCase(getOtherUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.otherUser = action.payload;
      })
      .addCase(getOtherUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.otherUser = [];
        state.message = action.payload
      })
  },
});

export const { reset, setCredentials, setOnlineUsers, addOnlineUser, removeOnlineUser } = authSlice.actions;
export default authSlice.reducer;


