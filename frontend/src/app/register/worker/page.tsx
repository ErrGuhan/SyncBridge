import React from 'react';
import WorkerRegistrationForm from '@/components/WorkerRegistrationForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Worker Registration & Skill Profiling — SyncBridge Cooperative',
  description: 'Join a democratic labour cooperative society, secure 80% direct pay, and access mutual aid insurance.',
};

export default function WorkerRegisterPage() {
  return (
    <div className="py-2">
      <WorkerRegistrationForm />
    </div>
  );
}
