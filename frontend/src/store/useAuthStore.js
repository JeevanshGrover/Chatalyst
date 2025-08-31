import {create} from 'zustand';
import { axiosInstance as axios } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfilePic: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axios.get("/auth/checkAuth");
            set({
                authUser: res.data.data
            });
        } catch (error) {
            console.log("error in checkAuth:", error);
            set({ authUser: null})
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        try {
            if(!data){
                console.log("No data provided for signup");
            }
            const res = await axios.post("/auth/signup", data);
            
            set({ authUser: res.data.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async(data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axios.post("/auth/login", data);
            set({ authUser: res.data.data });
            toast.success("Logged in successfully");
        } catch(error){
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    
    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data?.message || "Logout failed");
        }
    },

    updateProfilePic: async(data) => {
        set({ isUpdatingProfilePic: true });
        try {
            const res = await axios.patch("/auth/updateProfilePic", data);
            set({ authUser: res.data.data });
            toast.success("Profile picture updated");
        } catch (error) {
            console.log("error in updateProfilePic:", error);
            toast.error(error.response?.data?.message|| "error uploading the picture")
        } finally {
            set({ isUpdatingProfilePic: false });
        }
    }
}))