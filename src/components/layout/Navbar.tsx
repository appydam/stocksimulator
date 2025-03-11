
import React from 'react';
import { Bell, HelpCircle, User } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

export function Navbar() {
  const { state } = useTrading();
  const { marketOpen, cash } = state;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold tracking-tight">TradeSimulate</h1>
          <div className={`h-2 w-2 rounded-full ${marketOpen ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-muted-foreground">
            Market {marketOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">Available Cash</p>
              <p className="text-lg font-bold">{formatCurrency(cash)}</p>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
