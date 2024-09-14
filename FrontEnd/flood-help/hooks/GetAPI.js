import { useState, useEffect } from "react";

/**
 * Fetches API Data
 * @param {string} URL - The URL of the API from which data will be retrieved.
 * @param {string} method - The type of request (e.g. POST or GET).
 * @param {object} requestBody - The body of the request in JSON format.
 * @returns {array} - Array of objects containing relevant API data.
 */
const GetAPI = (URL, method, requestBody) => {
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchFromAPI = async () => {
            const data = await fetchData(URL, method, requestBody);
            setResult(data);
            // console.log(data);
        };
        fetchFromAPI();
    }, [URL, method, requestBody]);

    async function fetchData(URL, method, requestBody) {
        try {
            const response = await fetch(URL, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
            });
            const result = await response.json();
            // console.log("Your intended result is: ", result);
            return result;
        } catch (error) {
             console.error('Fetch error:', error);
            return null;
        }
    }

    return result
};

export default GetAPI;
