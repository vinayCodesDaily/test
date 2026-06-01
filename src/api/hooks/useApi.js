import { useState } from 'react';
import axiosClient from '../axiosClient';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = async (method, url, data = null, config = {}) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axiosClient({
                method,
                url,
                data,
                ...config,
            });

            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || err.message || 'An unexpected error occurred';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        get: (url, config) => request('GET', url, null, config),
        post: (url, data, config) => request('POST', url, data, config),
        put: (url, data, config) => request('PUT', url, data, config),
        delete: (url, config) => request('DELETE', url, null, config),
    };
};
