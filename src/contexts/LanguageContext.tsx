// contexts/LanguageContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";

type Locale = "en" | "he";

interface LanguageContextType {
  currentLang: Locale;
  setCurrentLang: (lang: Locale) => void;
  isRTL: boolean;
  isLoading: boolean;
}

// ✅ Create Context
const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
}

// ✅ Language Provider Component
export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLang, setCurrentLangState] = useState<Locale>("he");
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // ✅ RTL detection
  const isRTL = currentLang === "he";

  // ✅ Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = currentLang;

    // Add RTL class to body for better CSS targeting
    if (isRTL) {
      document.body.classList.add("rtl");
      document.body.classList.remove("ltr");
    } else {
      document.body.classList.add("ltr");
      document.body.classList.remove("rtl");
    }
  }, [currentLang, isRTL]);

  // ✅ Language setter with loading state
  const setCurrentLang = async (lang: Locale) => {
    if (lang === currentLang) return; // Don't update if same language

    setIsLoading(true);
    setCurrentLangState(lang);

    console.log(`🌐 Language switched to: ${lang}, RTL: ${lang === "he"}`);

    // Simulate loading time for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // ✅ Initialize language from localStorage or default
  useEffect(() => {
    const savedLang = localStorage.getItem("preferred-language") as Locale;
    if (savedLang && (savedLang === "en" || savedLang === "he")) {
      setCurrentLangState(savedLang);
    }
  }, []);

  // ✅ Save language preference
  useEffect(() => {
    localStorage.setItem("preferred-language", currentLang);
  }, [currentLang]);

  const contextValue: LanguageContextType = {
    currentLang,
    setCurrentLang,
    isRTL,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

// ✅ Custom hook to use Language Context
export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
}

// ✅ Export context for advanced usage
export { LanguageContext };
