
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { WatchlistOverview } from '@/components/dashboard/WatchlistOverview';
import { ChevronDown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/contexts/TradingContext';

export default function WatchlistPage() {
  const { state } = useTrading();
  const watchlistCount = state.watchlist.length;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Watchlist</h1>
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                {watchlistCount}
              </span>
            </div>
            <p className="text-muted-foreground">Track stocks you're interested in</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1.5">
              <Star className="h-4 w-4" />
              <span>All Watchlists</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              Create New
            </Button>
          </div>
        </div>
        
        <WatchlistOverview />
      </div>
    </AppLayout>
  );
}
