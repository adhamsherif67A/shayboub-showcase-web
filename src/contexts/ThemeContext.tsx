import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ThemeContextType {
  highContrast: boolean;
  toggleHighContrast: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem("shayboub_high_contrast");
    return saved === "true";
  });

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("shayboub_dark_mode");
    return saved === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (highContrast) {
      root.classList.add("high-contrast");
    } else {
      root.classList.remove("high-contrast");
    }

    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [highContrast, darkMode]);

  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    localStorage.setItem("shayboub_high_contrast", String(newValue));
  };

  const toggleDarkMode = () => {
    const newValue = !darkMode;
    setDarkMode(newValue);
    localStorage.setItem("shayboub_dark_mode", String(newValue));
  };

  return (
    <ThemeContext.Provider value={{ highContrast, toggleHighContrast, darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
