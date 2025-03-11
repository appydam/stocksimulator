
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingProvider } from '@/contexts/TradingContext';
import { MarketOverview } from '@/components/dashboard/MarketOverview';

export default function MarketPage() {
  return (
    <TradingProvider>
      <AppLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Market Overview</h1>
          <MarketOverview />
        </div>
      </AppLayout>
    </TradingProvider>
  );
}
