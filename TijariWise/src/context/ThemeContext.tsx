import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme } from '../themes/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'light' | 'dark' | 'auto';


const ThemeContext = createContext({
  theme: darkTheme,
  themeType: 'auto' as ThemeType,
  setThemeType: (_: ThemeType) => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('auto');

  const resolvedTheme = themeType === 'auto'
    ? systemScheme === 'dark' ? darkTheme : lightTheme
    : themeType === 'dark' ? darkTheme : lightTheme;

    useEffect(() => {
  const loadTheme = async () => {
    const savedType = await AsyncStorage.getItem('theme_type');
    if (savedType === 'dark' || savedType === 'light' || savedType === 'auto') {
      setThemeType(savedType as ThemeType);
    }
  };
  loadTheme();
}, []);

const updateTheme = async (newType: ThemeType) => {
  setThemeType(newType);
  await AsyncStorage.setItem('theme_type', newType);
};
    

  return (
    <ThemeContext.Provider value={{ theme: resolvedTheme, themeType, setThemeType: updateTheme }}>

      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
