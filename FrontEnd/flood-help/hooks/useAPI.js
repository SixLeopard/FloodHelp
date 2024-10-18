import { useEffect, useState } from 'react';
import { fetchData } from '@/services/apiService';
import { baseURL } from '@/constants/baseurl';

/**
 * UseAPI is returns a response from the database, dependant on the provided endpoint.
 * It is designed to be reusable, so that the baseURL can be adjusted if the server is moved to a
 * different location.
 *
 * @param endpoint
 * @param requestBody
 * @param method
 * @returns {unknown}
 */
const useAPI = (endpoint, requestBody = null, method = 'GET') => {
    const test = baseURL;
    console.log(test);
    const baseUrL = baseURL;
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
