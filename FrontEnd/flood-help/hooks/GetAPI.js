import { useEffect, useState } from "react";

/**
 * Fetches API Data
 * @param {string} endpoint - The second part of the API URL after the base.
 * @param {object|null} requestBody - The body of the request in JSON format, or null if nobody is needed.
 * @returns {array|null} - Array of objects containing relevant API data or null if loading.
 */
const GetAPI = (endpoint, requestBody = null) => {
    const baseURL = "http://54.206.190.121:5000";
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchFromAPI = async () => {
            const data = await fetchData(`${baseURL}${endpoint}`, requestBody);
            setResult(data);
        };
        fetchFromAPI();
    }, [endpoint, requestBody]);

    async function fetchData(URL, body) {
        try {
            const response = await fetch(URL, {
                method: body ? 'POST' : 'GET',
                headers: body ?{ 'Content-Type': 'multipart/form-data'} : {
                    'Content-Type': 'application/json',
                },
                body: body ? body : null,
            });
            console.log(URL);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    return result;
};

export default GetAPI;
