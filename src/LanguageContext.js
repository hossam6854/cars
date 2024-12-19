import React, { createContext, useState, useContext } from 'react';

// إنشاء سياق اللغة
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // اللغة الافتراضية: الإنجليزية

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === 'en' ? 'ar' : 'en'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// خطاف لاستخدام سياق اللغة
export const useLanguage = () => useContext(LanguageContext);
