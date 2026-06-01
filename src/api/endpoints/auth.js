import axiosClient from '../axiosClient';

export const authAPI = {
    register: (data) => axiosClient.post('/auth/register', data),
    login: (email, password) => 
        axiosClient.post('/auth/login', { email, password }),
    logout: () => axiosClient.post('/auth/logout'),
    getProfile: () => axiosClient.get('/auth/profile'),
    updateProfile: (data) => axiosClient.put('/auth/profile', data),
    changePassword: (data) => axiosClient.post('/auth/change-password', data),
};
