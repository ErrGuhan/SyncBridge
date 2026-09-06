import type { Metadata } from 'next';
import Link from 'next/link';
import { Geist, Geist_Mono } from 'next/font/google';
import TopAccessibleHeader from '@/components/TopAccessibleHeader';
import BottomNavigation from '@/components/BottomNavigation';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/context/AuthContext';
import { CoopDataProvider } from '@/context/CoopDataContext';
import { NAV_LINKS, EMERGENCY_LINK } from '@/config/nav';
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
          <AuthProvider>
            <CoopDataProvider>
              {/* Top Enterprise Application Header */}
              <TopAccessibleHeader />

              {/* Main Content Viewport */}
              <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
                {children}
              </main>

              {/* Cooperative Sovereign Infrastructure Footer */}
              <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mb-16 md:mb-0">
                <div className="max-w-6xl mx-auto space-y-4">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-bold text-slate-800">SyncBridge Cooperative Federation</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600">100% Worker-Member Owned</span>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Audited 90/5/5 Charter
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-medium text-slate-600 flex-wrap justify-center">
                      <span className="flex items-center gap-1">
                        <strong className="text-emerald-700">90%</strong> Worker Take-Home
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <strong className="text-blue-700">5%</strong> Society Reserve
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <strong className="text-amber-700">5%</strong> Welfare Trust
                      </span>
                    </div>
                  </div>

                  {/* Shared Navigation Links */}
                  <div className="flex items-center justify-between gap-4 flex-wrap text-xs pt-1 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap font-medium">
                      {NAV_LINKS.map(link => (
                        <Link key={link.href} href={link.href} className="text-slate-600 hover:text-blue-600 transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                    <Link
                      href={EMERGENCY_LINK.href}
                      className="text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>{EMERGENCY_LINK.label}</span>
                    </Link>
                  </div>

                  {/* Sovereign Tech & Compliance Metadata */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
                    <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <span>Smart India Hackathon 2026</span>
                      <span>|</span>
                      <span className="font-mono text-slate-600 font-semibold">PS ID: 26089</span>
                      <span>|</span>
                      <span>NCCT / Ministry of Cooperation</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap justify-center">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        Hosted on MeghRaj (GI Cloud)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        DPDP Act 2023 Compliant
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200/60">
                        Cooperative Data Commons
                      </span>
                    </div>
                  </div>
                </div>
              </footer>

              {/* Mobile Bottom Navigation Bar (Hidden on Desktop) */}
              <BottomNavigation />
            </CoopDataProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
