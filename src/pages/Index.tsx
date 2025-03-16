
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingProvider } from '@/contexts/TradingContext';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function Index() {
  return (
    <TradingProvider>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </TradingProvider>
  );
}
