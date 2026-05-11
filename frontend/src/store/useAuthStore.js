import { create } from 'zustand';
import { axiosInstance as axios } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfilePic: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axios.get("/auth/checkAuth");
            set({
                authUser: res.data.data
            });
            get().connectSocket();
        } catch (error) {
            // console.log("error in checkAuth:", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            if (!data) {
                console.log("No data provided for signup");
            }
            await axios.post("/auth/signup", data);
            return true;
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
            return false;
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post("/auth/login", data);
            const user = res.data.data;
            set({ authUser: user });
            
            get().connectSocket();
            get().checkAuth();
            
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            get().disconnectSocket();
            set({ authUser: null, onlineUsers: [] });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Logout failed");
        }
    },


    updateProfilePic: async (data) => {
        set({ isUpdatingProfilePic: true });
        try {
            const res = await axios.patch("/auth/updateProfilePic", data);
            set({ authUser: res.data.data });
            toast.success("Profile picture updated");
        } catch (error) {
            // console.log("error in updateProfilePic:", error);
            toast.error(error.response?.data?.message || "error uploading the picture")
        } finally {
            set({ isUpdatingProfilePic: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser?._id || socket?.connected) return;

        const newSocket = io(BASE_URL, {
            query: { userId: authUser._id },
            transports: ["websocket"],
        });

        newSocket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds.filter(Boolean) });
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))