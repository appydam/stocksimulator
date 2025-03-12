
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Stock } from '@/data/stocks';
import { formatCurrency, formatNumber, formatPercentage, getColorForChange } from '@/lib/utils';
import { ArrowUpRight, ArrowDownRight, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTrading } from '@/contexts/TradingContext';

interface StockCardProps {
  stock: Stock;
  onSelect: (stock: Stock) => void;
}

export function StockCard({ stock, onSelect }: StockCardProps) {
  const { state, addToWatchlist, removeFromWatchlist } = useTrading();
  
  const isInWatchlist = state.watchlist.some(item => item.stockId === stock.id);
  
  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist) {
      removeFromWatchlist(stock.id);
    } else {
      addToWatchlist(stock.id);
    }
  };
  
  return (
    <Card 
      className="relative hover:shadow-md transition-all cursor-pointer overflow-hidden border border-border/50 hover:border-primary/20 bg-card/70 backdrop-blur-sm"
      onClick={() => onSelect(stock)}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${stock.changePercent >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`} />
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-lg">{stock.symbol}</h3>
              <span className="text-xs text-muted-foreground">{stock.exchange}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[180px]" title={stock.name}>
              {stock.name}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleWatchlistToggle}
            title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          >
            <Star 
              className={`h-4 w-4 ${isInWatchlist ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div>
            <div className="text-xl font-bold">{formatCurrency(stock.currentPrice)}</div>
            <div className={`flex items-center text-sm ${getColorForChange(stock.changePercent)}`}>
              {stock.changePercent > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : stock.changePercent < 0 ? (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              <span>
                {formatCurrency(stock.change)} ({formatPercentage(stock.changePercent)})
              </span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs font-medium">Range</div>
            <div className="text-xs text-muted-foreground">
              {formatCurrency(stock.dayLow)} - {formatCurrency(stock.dayHigh)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
