
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { TradingProvider } from '@/contexts/TradingContext';
import { WatchlistOverview } from '@/components/dashboard/WatchlistOverview';

export default function WatchlistPage() {
  return (
    <TradingProvider>
      <AppLayout>
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">My Watchlist</h1>
          <WatchlistOverview />
        </div>
      </AppLayout>
    </TradingProvider>
  );
}
