import { useState, useEffect, useCallback, useRef } from 'react';
import axiosClient from '../axiosClient';

export const useFetch = (url, options = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const optionsRef = useRef(options);
    
    useEffect(() => {
        optionsRef.current = options;
    });

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axiosClient.get(url, optionsRef.current);
            if (response.data.success) {
                setData(response.data.data);
            } else {
                setError(response.data.message || 'Failed to fetch data');
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 0);
        return () => clearTimeout(timer);
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData, setData };
};
