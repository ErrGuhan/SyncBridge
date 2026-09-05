import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SyncBridge — Cooperative Gig Services Platform",
  description: "Democratic, worker-owned cooperative gig platform empowering skilled trade workers with direct patronage, fair wages, and mutual aid insurance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-screen flex flex-col bg-ambient text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
        {/* Decorative Top Radial Light Source */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-48 bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Global Navigation Shell */}
        <Navbar />

        {/* Main Content Area (with bottom padding for mobile sticky nav) */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12">
          {children}
        </main>

        {/* Cooperative Platform Footer */}
        <footer className="border-t border-white/5 bg-slate-950/60 backdrop-blur-md py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm hidden md:block">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium">SyncBridge Cooperative Federation</span>
              <span className="text-slate-500">|</span>
              <span className="text-xs text-slate-400">Microservices Mesh Active (Ports 3000-3003)</span>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="hover:text-cyan-300 transition-colors">80% Direct Worker Wallet</span>
              <span>•</span>
              <span className="hover:text-cyan-300 transition-colors">15% Cooperative Capital Fund</span>
              <span>•</span>
              <span className="hover:text-cyan-300 transition-colors">5% Mutual Aid & Welfare</span>
            </div>
            
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Labour Cooperative Federation. All rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
