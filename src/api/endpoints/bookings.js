import axiosClient from '../axiosClient';

export const bookingsAPI = {
    getAll: (params = {}) => axiosClient.get('/bookings', { params }),
    getById: (id) => axiosClient.get(`/bookings/${id}`),
    create: (data) => axiosClient.post('/bookings', data),
    cancel: (id) => axiosClient.post(`/bookings/${id}/cancel`),
    confirm: (id) => axiosClient.post(`/bookings/${id}/confirm`), // Manager
    processPayment: (id, data) => 
        axiosClient.post(`/bookings/${id}/payment`, data),
    getInvoice: (id) => axiosClient.get(`/bookings/${id}/invoice`),
};
