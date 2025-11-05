import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

// Supported locales
export const locales = [
  'en', 'es', 'pt', 'fr', 'de', 'it', 'hi', 'zh', 'ja', 'ar',
  'ko', 'ru', 'id', 'tr', 'nl', 'pl', 'th', 'vi', 'uk'
] as const;

export type Locale = typeof locales[number];

// Language configurations
export const languages = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,000.00',
    rtl: false
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    currency: 'USD',
    currencySymbol: '$',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    currency: 'BRL',
    currencySymbol: 'R$',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    currency: 'EUR',
    currencySymbol: '€',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1 000,00',
    rtl: false
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    currency: 'EUR',
    currencySymbol: '€',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    currency: 'EUR',
    currencySymbol: '€',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    currency: 'INR',
    currencySymbol: '₹',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,00,000.00',
    rtl: false
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    currency: 'CNY',
    currencySymbol: '¥',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: '1,000.00',
    rtl: false
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    currency: 'JPY',
    currencySymbol: '¥',
    dateFormat: 'YYYY/MM/DD',
    numberFormat: '1,000',
    rtl: false
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    currency: 'SAR',
    currencySymbol: 'ر.س',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,000.00',
    rtl: true
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    currency: 'KRW',
    currencySymbol: '₩',
    dateFormat: 'YYYY.MM.DD',
    numberFormat: '1,000',
    rtl: false
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    currency: 'RUB',
    currencySymbol: '₽',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1 000,00',
    rtl: false
  },
  id: {
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    currency: 'IDR',
    currencySymbol: 'Rp',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  tr: {
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    currency: 'TRY',
    currencySymbol: '₺',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  nl: {
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    currency: 'EUR',
    currencySymbol: '€',
    dateFormat: 'DD-MM-YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  pl: {
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    currency: 'PLN',
    currencySymbol: 'zł',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1 000,00',
    rtl: false
  },
  th: {
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    currency: 'THB',
    currencySymbol: '฿',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1,000.00',
    rtl: false
  },
  vi: {
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    currency: 'VND',
    currencySymbol: '₫',
    dateFormat: 'DD/MM/YYYY',
    numberFormat: '1.000,00',
    rtl: false
  },
  uk: {
    name: 'Ukrainian',
    nativeName: 'Українська',
    flag: '🇺🇦',
    currency: 'UAH',
    currencySymbol: '₴',
    dateFormat: 'DD.MM.YYYY',
    numberFormat: '1 000,00',
    rtl: false
  }
} as const;

// Translation cache
const translationCache = new Map<string, any>();

// Load translations for a specific locale
export async function loadTranslations(locale: Locale) {
  if (translationCache.has(locale)) {
    return translationCache.get(locale);
  }

  try {
    const translations = await import(`./locales/${locale}.json`);
    translationCache.set(locale, translations.default);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for locale: ${locale}`, error);
    // Fallback to English
    if (locale !== 'en') {
      return loadTranslations('en');
    }
    return {};
  }
}

// Get nested translation value
export function getTranslation(translations: any, key: string, params?: Record<string, string | number>): string {
  const keys = key.split('.');
  let value = translations;

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  if (typeof value !== 'string') {
    return key;
  }

  // Replace parameters
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }

  return value;
}

// Format currency based on locale
export function formatCurrency(amount: number, locale: Locale): string {
  const config = languages[locale];
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: config.currency === 'JPY' ? 0 : 2,
      maximumFractionDigits: config.currency === 'JPY' ? 0 : 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `${config.currencySymbol}${amount.toLocaleString()}`;
  }
}

// Format number based on locale
export function formatNumber(number: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale).format(number);
  } catch (error) {
    return number.toLocaleString();
  }
}

// Format date based on locale
export function formatDate(date: Date, locale: Locale): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  } catch (error) {
    return date.toLocaleDateString();
  }
}

// Get browser locale
export function getBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.split('-')[0] as Locale;
  return locales.includes(browserLang) ? browserLang : 'en';
}

// Detect user's preferred locale
export function detectLocale(): Locale {
  // Check URL parameter
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Locale;
    if (urlLang && locales.includes(urlLang)) {
      return urlLang;
    }
  }

  // Check localStorage
  if (typeof window !== 'undefined') {
    const storedLang = localStorage.getItem('preferred-language') as Locale;
    if (storedLang && locales.includes(storedLang)) {
      return storedLang;
    }
  }

  // Check browser language
  return getBrowserLocale();
}

// Save locale preference
export function saveLocalePreference(locale: Locale) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('preferred-language', locale);
  }
}

// Hook for translations
export function useTranslations() {
  const router = useRouter();
  const [translations, setTranslations] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  const locale = (router.locale || 'en') as Locale;

  useEffect(() => {
    loadTranslations(locale).then((t) => {
      setTranslations(t);
      setLoading(false);
    });
  }, [locale]);

  const t = (key: string, params?: Record<string, string | number>) => {
    return getTranslation(translations, key, params);
  };

  return {
    t,
    locale,
    loading,
    isRTL: languages[locale]?.rtl || false,
    currency: languages[locale]?.currency || 'USD',
    currencySymbol: languages[locale]?.currencySymbol || '$',
    formatCurrency: (amount: number) => formatCurrency(amount, locale),
    formatNumber: (number: number) => formatNumber(number, locale),
    formatDate: (date: Date) => formatDate(date, locale)
  };
}

// Hook for locale management
export function useLocale() {
  const router = useRouter();
  const currentLocale = (router.locale || 'en') as Locale;

  const changeLocale = (newLocale: Locale) => {
    saveLocalePreference(newLocale);
    router.push(router.asPath, router.asPath, { locale: newLocale });
  };

  return {
    locale: currentLocale,
    changeLocale,
    languages,
    locales
  };
}