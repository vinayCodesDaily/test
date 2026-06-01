import axiosClient from '../axiosClient';

export const inquiriesAPI = {
    // Public
    submit: (data) => axiosClient.post('/inquiries', data),

    // Authenticated
    getAll: (params = {}) => axiosClient.get('/inquiries', { params }),
    getById: (id) => axiosClient.get(`/inquiries/${id}`),
    updateStatus: (id, data) => 
        axiosClient.put(`/inquiries/${id}/status`, data),

    // Manager
    assignToConsultant: (id, consultantId) => 
        axiosClient.post(`/inquiries/${id}/assign`, { 
            consultant_id: consultantId 
        }),
};
