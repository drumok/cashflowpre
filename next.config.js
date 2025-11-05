/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standard Next.js build for Vercel
  // output: 'export', // Removed for Vercel deployment
  // distDir: 'out', // Removed for Vercel deployment
  
  // Disable static optimization for dynamic routes
  trailingSlash: false,
  
  // Skip build static optimization for problematic pages
  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/firestore', 'braintree'],
    missingSuspenseWithCSRBailout: false,
  },
  

  
  // Force dynamic rendering for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, must-revalidate' },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
        ],
      },
    ];
  },

  // Disable telemetry in production
  // telemetry: false, // This option is not valid in Next.js config

  // Internationalization configuration - temporarily disabled for deployment
  // i18n: {
  //   locales: [
  //     'en',    // English (default)
  //     'es',    // Spanish
  //     'pt',    // Portuguese  
  //     'fr',    // French
  //     'de',    // German
  //     'it',    // Italian
  //     'hi',    // Hindi
  //     'zh',    // Mandarin Chinese
  //     'ja',    // Japanese
  //     'ar',    // Arabic
  //     'ko',    // Korean
  //     'ru',    // Russian
  //     'id',    // Indonesian
  //     'tr',    // Turkish
  //     'nl',    // Dutch
  //     'pl',    // Polish
  //     'th',    // Thai
  //     'vi',    // Vietnamese
  //     'uk'     // Ukrainian
  //   ],
  //   defaultLocale: 'en',
  //   localeDetection: false,
  //   domains: [
  //     {
  //       domain: 'smbanalytics.com',
  //       defaultLocale: 'en',
  //     },
  //     {
  //       domain: 'es.smbanalytics.com',
  //       defaultLocale: 'es',
  //     },
  //     {
  //       domain: 'pt.smbanalytics.com', 
  //       defaultLocale: 'pt',
  //     },
  //     {
  //       domain: 'fr.smbanalytics.com',
  //       defaultLocale: 'fr',
  //     },
  //     {
  //       domain: 'de.smbanalytics.com',
  //       defaultLocale: 'de',
  //     },
  //     {
  //       domain: 'it.smbanalytics.com',
  //       defaultLocale: 'it',
  //     },
  //     {
  //       domain: 'hi.smbanalytics.com',
  //       defaultLocale: 'hi',
  //     },
  //     {
  //       domain: 'zh.smbanalytics.com',
  //       defaultLocale: 'zh',
  //     },
  //     {
  //       domain: 'ja.smbanalytics.com',
  //       defaultLocale: 'ja',
  //     },
  //     {
  //       domain: 'ar.smbanalytics.com',
  //       defaultLocale: 'ar',
  //     },
  //     {
  //       domain: 'ko.smbanalytics.com',
  //       defaultLocale: 'ko',
  //     },
  //     {
  //       domain: 'ru.smbanalytics.com',
  //       defaultLocale: 'ru',
  //     },
  //     {
  //       domain: 'id.smbanalytics.com',
  //       defaultLocale: 'id',
  //     },
  //     {
  //       domain: 'tr.smbanalytics.com',
  //       defaultLocale: 'tr',
  //     },
  //     {
  //       domain: 'nl.smbanalytics.com',
  //       defaultLocale: 'nl',
  //     },
  //     {
  //       domain: 'pl.smbanalytics.com',
  //       defaultLocale: 'pl',
  //     },
  //     {
  //       domain: 'th.smbanalytics.com',
  //       defaultLocale: 'th',
  //     },
  //     {
  //       domain: 'vi.smbanalytics.com',
  //       defaultLocale: 'vi',
  //     },
  //     {
  //       domain: 'uk.smbanalytics.com',
  //       defaultLocale: 'uk',
  //     }
  //   ]
  // },



  // Image optimization
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'lh3.googleusercontent.com', // Google profile images
    ],
    formats: ['image/webp', 'image/avif'],
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Webpack configuration
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Custom webpack config for better performance
    if (!dev && !isServer) {
      config.optimization.splitChunks.chunks = 'all';
    }
    
    return config;
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/',
        permanent: false,
      },
      {
        source: '/signup',
        destination: '/',
        permanent: false,
      },
    ];
  },

  // Rewrites for API routes
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig;