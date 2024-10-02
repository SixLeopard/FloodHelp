import { useEffect, useState } from 'react';
import { fetchData } from '@/services/apiService';

const useAPI = (endpoint, requestBody = null, method = 'GET') => {
    const baseURL = 'http://54.206.190.121:5000';
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchFromAPI = async () => {
            const data = await fetchData(`${baseURL}${endpoint}`, requestBody, method);
            setResult(data);
        };
        fetchFromAPI();
    }, [endpoint, requestBody]);

    return result;
};

export default useAPI;
