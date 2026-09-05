import React from 'react';
import ServiceDiscovery from '@/components/ServiceDiscovery';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Services — SyncBridge Cooperative Gig Platform',
  description: 'Search and book verified tradespeople and skilled gig workers within 10 km.',
};

export default function ServicesPage() {
  return (
    <div className="py-2">
      <ServiceDiscovery />
    </div>
  );
}
