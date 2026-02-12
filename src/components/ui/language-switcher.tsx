// components/ui/language-switcher.tsx
"use client";

import { motion } from 'framer-motion';
import { GlobeIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageSwitcher() {
  // ✅ FIXED: Use correct property names from context
  const { currentLang, setCurrentLang, isRTL } = useLanguage();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'he', name: 'עברית', flag: '🇮🇱' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border hover:bg-primary/10 transition-all duration-300"
          >
            <GlobeIcon className="w-4 h-4" />
            <span className="hidden sm:inline">
              {/* ✅ FIXED: Use currentLang instead of locale */}
              {languages.find(lang => lang.code === currentLang)?.flag}
            </span>
            <span className="hidden md:inline text-xs">
              {/* ✅ FIXED: Use currentLang instead of locale */}
              {languages.find(lang => lang.code === currentLang)?.name}
            </span>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align={isRTL ? "start" : "end"} className="min-w-[120px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            // ✅ FIXED: Use setCurrentLang instead of setLocale
            onClick={() => setCurrentLang(language.code as 'en' | 'he')}
            className={`flex items-center gap-3 cursor-pointer transition-all duration-200 ${
              // ✅ FIXED: Use currentLang instead of locale
              currentLang === language.code 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'hover:bg-primary/5'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <span className="text-sm">{language.name}</span>
            {/* ✅ FIXED: Use currentLang instead of locale */}
            {currentLang === language.code && (
              <motion.div
                className="w-2 h-2 bg-primary rounded-full ml-auto"
                layoutId="activeLanguage"
                transition={{ duration: 0.2 }}
              />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
