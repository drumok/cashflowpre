'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useLocale, languages } from '@/lib/i18n';

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { locale, changeLocale } = useLocale();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages[locale];
  const languageList = Object.entries(languages);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (newLocale: string) => {
    changeLocale(newLocale as any);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Globe size={16} />
        <span className="text-sm font-medium">{currentLanguage.flag}</span>
        <span className="hidden sm:inline text-sm">{currentLanguage.nativeName}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-64 overflow-y-auto">
          {languageList.map(([langCode, langConfig]) => (
            <button
              key={langCode}
              onClick={() => handleLanguageChange(langCode)}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                locale === langCode ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
              dir={langConfig.rtl ? 'rtl' : 'ltr'}
            >
              <span className="text-lg">{langConfig.flag}</span>
              <div className="flex-1">
                <div className="font-medium">{langConfig.nativeName}</div>
                <div className="text-sm text-gray-500">{langConfig.name}</div>
              </div>
              {locale === langCode && (
                <span className="text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}