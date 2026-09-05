import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import TopAccessibleHeader from '@/components/TopAccessibleHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { LanguageProvider } from '@/context/LanguageContext';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SyncBridge — Cooperative Gig Services Platform',
  description:
    'Accessible, high-contrast cooperative platform connecting skilled trade workers directly with local households and businesses.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-100 text-black selection:bg-yellow-300 selection:text-black">
        <LanguageProvider>
          {/* Mobile-First Frame: mimics native app on desktop while filling budget mobile screens */}
          <div className="w-full max-w-md sm:max-w-xl md:max-w-3xl mx-auto min-h-screen flex flex-col bg-white md:border-x-2 md:border-black shadow-2xl relative">
            {/* Top Accessible Header with A/अ Language Toggle & SOS */}
            <TopAccessibleHeader />

            {/* Main Content Area with bottom padding to avoid overlap with fixed bottom navigation */}
            <main className="flex-1 px-3 sm:px-5 py-4 pb-28">
              {children}
            </main>

            {/* Fixed Mobile Bottom Navigation Bar */}
            <BottomNavigation />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
