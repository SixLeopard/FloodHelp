const baseUrl = 'http://54.206.190.121:5000';
import * as FileSystem from 'expo-file-system';

// Function to submit a new report to the backend
export const submitReport = async (report: {
    location: string,
    type: string,
    description: string,
    image?: any
    token: string,
    email: string
}) => {
    const body = new FormData();
    body.append('location', report.location);
    body.append('type', report.type);
    body.append('description', report.description || '');

    console.log('Report Details:', { location: report.location, type: report.type, description: report.description });

    if (report.image) {
        try {
            const uriParts = report.image.split('.');
            const fileType = uriParts[uriParts.length - 1];
            // Append the local file directly to FormData
            body.append('image', {
                uri: report.image,
                name: `photo.${fileType}`,
                type: `image/${fileType}`, // Ensure the correct MIME type
            }as any);
            console.log('Appending local image from URI:', report.image);

        } catch (imageError) {
            console.error('Error processing image:', imageError);
            throw new Error('Image processing failed.');
        }
    }

    try {
        const requestOptions: RequestInit = {
            method: 'POST',
            body: body,
            credentials: 'include', // Make sure cookies (sessions) are sent with the request
        };

        console.log('Sending POST request to:', `${baseUrl}/reporting/user/add_report`);

        const response = await fetch(`${baseUrl}/reporting/user/add_report`, requestOptions);

        console.log('Response received:', response);

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || `HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Report submitted successfully:', data);
        return data;
    } catch (error) {
        console.error('Error submitting report:', (error as Error).message || error);
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
