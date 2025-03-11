
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Star, TrendingUp } from 'lucide-react';
import { Stock } from '@/data/stocks';
import { formatCurrency, formatPercentage, getColorForChange } from '@/lib/utils';
import { useTrading } from '@/contexts/TradingContext';

interface StockCardProps {
  stock: Stock;
  onSelect?: (stock: Stock) => void;
  showActions?: boolean;
}

export function StockCard({ stock, onSelect, showActions = true }: StockCardProps) {
  const { state, addToWatchlist, removeFromWatchlist } = useTrading();
  const isInWatchlist = state.watchlist.some(item => item.stockId === stock.id);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(stock.id);
    } else {
      addToWatchlist(stock.id);
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(stock);
    }
  };

  return (
    <Card 
      className="hover:border-primary transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold">{stock.symbol}</h3>
              <span className="text-xs bg-muted px-2 py-0.5 rounded-sm">{stock.exchange}</span>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{stock.name}</p>
          </div>
          {showActions && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              onClick={handleStarClick}
            >
              <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
          )}
        </div>
        
        <div className="mt-3 flex justify-between items-end">
          <div>
            <div className="text-lg font-bold">{formatCurrency(stock.currentPrice)}</div>
            <div className="flex items-center gap-1">
              <span className={getColorForChange(stock.changePercent)}>
                {stock.changePercent > 0 ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : stock.changePercent < 0 ? (
                  <ArrowDownRight className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3" />
                )}
              </span>
              <span className={`text-sm ${getColorForChange(stock.changePercent)}`}>
                {formatPercentage(stock.changePercent)}
              </span>
            </div>
          </div>
          
          {showActions && (
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-8">Buy</Button>
              <Button size="sm" variant="outline" className="h-8">Sell</Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
