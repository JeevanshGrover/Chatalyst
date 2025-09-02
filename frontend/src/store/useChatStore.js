import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance as axios } from '../lib/axios.js';

const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axios.get('/message/users');
            set({ users: res.data.data });
        } catch (error) {
            toast.error(error?.response?.data?.message || "unable to detch users")
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axios.get(`/message/${userId}`);
            set({ messages: res.data.data })
        } catch (error) {
            
        }
    }
}))


export { useChatStore };