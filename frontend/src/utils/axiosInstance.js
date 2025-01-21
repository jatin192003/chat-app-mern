import axios from "axios";
import { logout, setCredentials } from "../store/slice/authSlice";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true,
})

const API_URL = '/user/';

const refreshAccessToken = async () => {
    const response = await axiosInstance.post(API_URL + 'refreshAccessToken');
    return response.data;
};

export const setupInterceptors = (store) => {
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = store.getState().auth.accessToken;
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    const { accessToken } = await refreshAccessToken();
                    store.dispatch(setCredentials({ accessToken }));
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    store.dispatch(logout());
                    return Promise.reject(refreshError);
                }
            }
            return Promise.reject(error);
        }
    );
}

export default axiosInstance;