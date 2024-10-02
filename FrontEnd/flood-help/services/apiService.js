export const fetchData = async (URL, body = null, method = 'GET') => {
    try {
        const response = await fetch(URL, {
            method: body ? 'POST' : method,
            headers: body ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
            body: body || null,
        });
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};
