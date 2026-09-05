import React from 'react';
import AdminDashboard from '@/components/AdminDashboard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cooperative Federation Admin Dashboard — SyncBridge',
  description: 'Manage worker skill verifications, monitor 80/15/5 patronage split, and audit cooperative federation reserves.',
};

export default function DashboardPage() {
  return (
    <div className="py-2">
      <AdminDashboard />
    </div>
  );
}
