import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance as axios } from '../lib/axios.js';
import { useAuthStore } from "./useAuthStore.js"

const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axios.get('/message/users');
            set({ users: res.data.data.users });
        } catch (error) {
            toast.error(error?.response?.data?.message || "unable to fetch users")
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axios.get(`/message/${userId}`);
            set({ messages: res.data.data.docs })
        } catch (error) {
            toast.error(error?.response?.data?.message || "unable to fetch messages")
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser?._id) {
            toast.error("no user selected");
            return;
        }
        try {
            const res = await axios.post(`/message/send/${selectedUser._id}`, messageData)
            set({ messages: [...(messages || []), res.data.data] })

            return res.data.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "unable to send message");
            if (error?.response?.status >= 400) {
                toast.error(error?.response?.data?.message || "Unable to send message");
            } else {
                toast.error("Network or unexpected error");
            }

            throw error;
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();  
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.sender !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser })
}))


export { useChatStore };