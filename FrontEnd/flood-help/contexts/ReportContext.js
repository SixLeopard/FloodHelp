import React, { createContext, useState, useContext, useEffect } from 'react';
import { submitReport, fetchReports } from '@/services/ReportService';

// Create the Report context
const ReportContext = createContext();

export const ReportProvider = ({ children }) => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to submit a new report
    const addReport = async (report) => {
        setLoading(true);
        setError(null);
        try {
            await submitReport(report);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to fetch all reports
    const getReports = async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedReports = await fetchReports();
            setReports(fetchedReports);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ReportContext.Provider value={{ reports, loading, error, addReport, getReports }}>
            {children}
        </ReportContext.Provider>
    );
};

// Custom hook to use the Report context
export const useReport = () => {
    const context = useContext(ReportContext);
    if (context === null) {
        throw new Error('useReport must be used within a ReportProvider');
    }

    return context;
};
