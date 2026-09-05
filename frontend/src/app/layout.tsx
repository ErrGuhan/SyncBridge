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
    'Democratic labour cooperative platform empowering trade workers with direct patronage, fair transparent wages, and mutual aid.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900">
        <LanguageProvider>
          {/* Top Enterprise Application Header */}
          <TopAccessibleHeader />

          {/* Main Content Viewport */}
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
            {children}
          </main>

          {/* Clean Desktop Footer */}
          <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 hidden md:block">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-semibold text-slate-700">SyncBridge Cooperative Federation</span>
                <span>•</span>
                <span>100% Worker-Member Owned</span>
              </div>
              <div className="flex items-center gap-6">
                <span>90% Direct Worker Take-Home</span>
                <span>5% Primary Society Reserve</span>
                <span>5% Mutual Aid & Healthcare</span>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
          <BottomNavigation />
        </LanguageProvider>
      </body>
    </html>
  );
}
