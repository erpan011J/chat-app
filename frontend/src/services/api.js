import axios from 'axios';

const baseURL = 'http://localhost:8000/api';

const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const createRoom = async (roomName, username) => {
    try {
        const response = await axiosInstance.post('/rooms/', {
            name: roomName,
            username,
        });
        console.log('Room created:', response.data);
        return response.data.id;
    } catch (error) {
        console.error('Error creating room:', error);
        throw new Error(error.response.data || error.message);
    }
};

export const joinRoom = async (roomName) => {
    try {
        const response = await axiosInstance.get(`/rooms/search/?name=${roomName}`);
        if (response.data.length === 0) {
            console.error('Room not found.');
            throw new Error('Room not found.');
        }
        console.log(response.data)
        return response.data.id;
    } catch (error) {
        console.error('Error joining room:', error);
        throw new Error(error.response.data || error.message);
    }
};


export const fetchMessages = async (roomName) => {
    try {
        const response = await axiosInstance.get(`/rooms/${roomName}/messages/`);
        return response.data
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw new Error(error.response.data || error.message);
    }
};

export default axiosInstance;
