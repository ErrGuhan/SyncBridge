import React, { Suspense } from 'react';
import ServiceDiscovery from '@/components/ServiceDiscovery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Services — SyncBridge Cooperative Gig Platform',
  description: 'Search and book verified tradespeople and skilled gig workers within 5 km.',
};

export default function ServicesPage() {
  return (
    <div className="py-2">
      <Suspense fallback={
        <div className="p-12 text-center text-xs text-slate-500">
          <div className="w-8 h-8 mx-auto border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <span>Loading Cooperative Trade Directory...</span>
        </div>
      }>
        <ServiceDiscovery />
      </Suspense>
    </div>
  );
}
