import React, { createContext, useContext, useState, useMemo } from 'react';
import { darkTheme } from '@/utilities/darkTheme';
import { lightTheme } from '@/utilities/lightTheme';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(lightTheme);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme.dark ? lightTheme : darkTheme));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
