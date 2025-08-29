import {create} from 'zustand';
import axios from 'axios';
import toast from 'react-hot-toast';


export const useAuthStore = create((set) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,

    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axios.get("/api/v1/auth/checkAuth");
            set({
                authUser: res.data
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
            const res = await axios.post("/api/v1/auth/signup", data);
            
            set({ authUser: res.data });
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
            const res = await axios.post("/api/v1/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch(error){
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    
    logout: async () => {
        try {
            await axios.post("/api/v1/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data?.message || "Logout failed");
        }
    },
}))