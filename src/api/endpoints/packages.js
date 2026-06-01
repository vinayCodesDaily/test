import axiosClient from '../axiosClient';

export const packagesAPI = {
    // Public access
    getAll: (params = {}) => axiosClient.get('/packages', { params }),
    getById: (id) => axiosClient.get(`/packages/${id}`),
    getDestinations: (params = {}) =>
        axiosClient.get('/destinations', { params }),
    getTripTypes: (params = {}) =>
        axiosClient.get('/trip-types', { params }),

    // Destination management (Manager)
    createDestination: (data) => axiosClient.post('/destinations', data),
    updateDestination: (id, data) => axiosClient.put(`/destinations/${id}`, data),
    deleteDestination: (id) => axiosClient.delete(`/destinations/${id}`),

    // Trip type management (Manager)
    createTripType: (data) => axiosClient.post('/trip-types', data),
    updateTripType: (id, data) => axiosClient.put(`/trip-types/${id}`, data),
    deleteTripType: (id) => axiosClient.delete(`/trip-types/${id}`),

    // Manager/Admin only
    create: (data) => axiosClient.post('/packages', data),
    update: (id, data) => axiosClient.put(`/packages/${id}`, data),
    delete: (id) => axiosClient.delete(`/packages/${id}`),
    addItinerary: (packageId, data) =>
        axiosClient.post(`/packages/${packageId}/itineraries`, data),
};
