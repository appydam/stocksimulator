
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';

export default function PortfolioPage() {
  return (
    <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">My Portfolio</h1>
        <PortfolioOverview />
      </div>
    </AppLayout>
  );
}
