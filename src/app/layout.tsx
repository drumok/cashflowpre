import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ClientProviders } from '@/components/providers/ClientProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SMB Analytics Platform - Turn Your Business Data Into Revenue Today',
  description: 'Global SMB Business Analytics & Lead Generation SaaS Platform that converts basic business data into immediate revenue opportunities with contact-centric actions.',
  keywords: 'SMB analytics, lead generation, business intelligence, revenue optimization, customer analysis',
  authors: [{ name: 'SMB Analytics Platform' }],
  openGraph: {
    title: 'SMB Analytics Platform - Turn Your Business Data Into Revenue Today',
    description: 'Convert your business data into immediate revenue opportunities with our global SMB analytics platform.',
    type: 'website',
    locale: 'en_US',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          <div id="root">
            {children}
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}