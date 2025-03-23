import { createContext, useState, useContext, useEffect } from 'react';

// Create a context for theme
export const ThemeContext = createContext();

// Custom hook to use theme context easily
export const useTheme = () => useContext(ThemeContext);

// Theme provider component
export const ThemeProvider = ({ children }) => {
  // Check if dark mode is stored in localStorage, or use user's system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    // Use system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Toggle dark mode function
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Update localStorage when dark mode changes
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    // Optional: update document class for global styles
    if (darkMode) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Provide theme context to children
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}; 