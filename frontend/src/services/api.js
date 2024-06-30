import axios from 'axios';
import { useChatStore } from '@/stores/chatStore'


const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getErrorMessage = (error) => {
    if (error.response.data) {
        const responseData = error.response.data;
        for (let key in responseData) {
            if (Array.isArray(responseData[key])) {
                return `${responseData[key][0]}`;
            } else {
                return `${responseData[key]}`;
            }
        }
        return 'Unknown error occurred';
    } else {
        return 'Network error occurred';
    }
};

const updateChatStore = (username, roomName) => {
    const chatStore = useChatStore()
    chatStore.setUserName(username);
    chatStore.setRoomName(roomName);
}

export const createRoom = async (roomName, username) => {
    try {
        const response = await axiosInstance.post('/rooms/', {
            name: roomName,
            username,
        });
        updateChatStore(username, roomName);
        return response.data.id;
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage);
    }
};

export const joinRoom = async (roomName, username) => {
    try {
        const response = await axiosInstance.get(`/rooms/search/?name=${roomName}`);
        if (response.data.length === 0) {
            throw new Error('Room not found.');
        }
        updateChatStore(username, roomName)
        return response.data.id;
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage);
    }
};


export const fetchMessages = async (roomName) => {
    try {
        const response = await axiosInstance.get(`/rooms/${roomName}/messages`);
        return response.data
    } catch (error) {
        const errorMessage = getErrorMessage(error)
        throw new Error(errorMessage);
    }
};

export default axiosInstance;
