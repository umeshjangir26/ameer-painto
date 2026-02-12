// hooks/useTranslations.ts
"use client";

import { useState, useEffect } from 'react';

type TranslationKey = string;
type Translations = Record<string, any>;

// Simple cache to avoid re-fetching
const translationsCache: Record<string, Translations> = {};

export function useTranslations(locale: string = 'en') {
  const [translations, setTranslations] = useState<Translations>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTranslations() {
      // Check cache first
      if (translationsCache[locale]) {
        setTranslations(translationsCache[locale]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/locales/${locale}/common.json`);
        
        if (!response.ok) {
          throw new Error('Translation file not found');
        }
        
        const data = await response.json();
        
        // Cache the translations
        translationsCache[locale] = data;
        setTranslations(data);
        
        console.log(`✅ Loaded ${locale} translations:`, data);
      } catch (error) {
        console.error(`❌ Failed to load ${locale} translations:`, error);
        
        // Fallback to English if Hebrew fails
        if (locale !== 'en') {
          try {
            const fallbackResponse = await fetch('/locales/en/common.json');
            const fallbackData = await fallbackResponse.json();
            setTranslations(fallbackData);
            console.log('✅ Loaded fallback English translations');
          } catch (fallbackError) {
            console.error('❌ Failed to load fallback translations:', fallbackError);
            // Set empty object as last resort
            setTranslations({});
          }
        }
      } finally {
        setLoading(false);
      }
    }

    loadTranslations();
  }, [locale]);

  // Simple translation function
  const t = (key: TranslationKey, fallback?: string): string => {
    const keys = key.split('.');
    let value = translations;
    
    // Navigate through nested object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Key not found, return fallback or key itself
        return fallback || key;
      }
    }
    
    return typeof value === 'string' ? value : (fallback || key);
  };

  return { t, loading, locale, translations };
}
