const baseUrl = 'http://54.206.190.121:5000';

// Function to submit a new report to the backend
export const submitReport = async (report: {
    location: string,
    type: string,
    description: string,
    image?: any
}) => {
    const body = new FormData();
    body.append('location', report.location);
    body.append('type', report.type);
    body.append('description', report.description || '');

    if (report.image) {
        const uriParts = report.image.split('.');
        const fileType = uriParts[uriParts.length - 1];
        const response = await fetch(report.image);
        const blob = await response.blob();
        body.append('image', blob, `photo.${fileType}`);
    }

    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: body,
            credentials: 'include' 
        };

        const response = await fetch(`${baseUrl}/reporting/user/add_report`, requestOptions);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP Error: ${response.status}`);
        }
        return data;
    } catch (error) {
        console.error("Error submitting report:", error);
        throw error;
    }
};

// Function to fetch all flood reports
export const fetchReports = async () => {
    try {
        const requestOptions: RequestInit = {
            method: 'GET',
            credentials: 'include' 
        };

        const response = await fetch(`${baseUrl}/reporting/user/get_all_report_basic`, requestOptions);

        if (!response.ok) {
            throw new Error('Failed to fetch reports');
        }

        const data = await response.json();
        return Object.keys(data).map(key => ({
            title: data[key].title,
            datetime: data[key].datetime,
            coordinates: data[key].coordinates,
        }));
    } catch (error) {
        console.error('Error fetching flood reports:', error);
        throw error;
    }
};
