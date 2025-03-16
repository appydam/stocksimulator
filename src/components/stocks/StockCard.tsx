
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Star, TrendingUp, BarChart3 } from 'lucide-react';
import { Stock } from '@/data/stocks';
import { formatCurrency, formatPercentage, getColorForChange } from '@/lib/utils';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addToWatchlist, removeFromWatchlist } from '@/store/tradingSlice';
import { toast } from '@/components/ui/use-toast';

interface StockCardProps {
  stock: Stock;
  onSelect?: (stock: Stock) => void;
  showActions?: boolean;
}

export function StockCard({ stock, onSelect, showActions = true }: StockCardProps) {
  const dispatch = useAppDispatch();
  const { watchlist } = useAppSelector(state => state.trading);
  const isInWatchlist = watchlist.some(item => item.stockId === stock.id);
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to add stocks to your watchlist",
        variant: "destructive",
      });
      return;
    }
    
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(stock.id));
    } else {
      dispatch(addToWatchlist(stock.id));
    }
  };

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(stock);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade stocks",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }
    
    if (onSelect) {
      onSelect(stock);
    }
  };

  const handleSellClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isSignedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to trade stocks",
        variant: "destructive",
      });
      navigate('/sign-in');
      return;
    }
    
    if (onSelect) {
      onSelect(stock);
    }
  };

  return (
    <Card 
      className="hover:border-primary transition-all duration-200 cursor-pointer overflow-hidden hover:shadow-md"
      onClick={handleCardClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-3 bg-secondary/30">
            <div className="flex items-center gap-2">
              <div className="font-mono font-bold text-primary">{stock.symbol}</div>
              <span className="text-xs bg-muted px-1.5 py-0.5 rounded-sm">{stock.exchange}</span>
            </div>
            {showActions && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7" 
                onClick={handleStarClick}
              >
                <Star className={`h-4 w-4 ${isInWatchlist ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              </Button>
            )}
          </div>
          
          <div className="p-3 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Last Price</p>
              <p className="text-lg font-bold">{formatCurrency(stock.currentPrice)}</p>
              <div className={`flex items-center gap-1 text-sm ${getColorForChange(stock.changePercent)}`}>
                {stock.changePercent > 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : stock.changePercent < 0 ? (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                ) : (
                  <TrendingUp className="h-3.5 w-3.5" />
                )}
                <span>{formatPercentage(stock.changePercent)}</span>
              </div>
            </div>
            
            <div className="flex items-end justify-end">
              {showActions && (
                <div className="flex flex-col gap-1.5 w-full">
                  <Button size="sm" variant="default" className="w-full" onClick={handleBuyClick}>Buy</Button>
                  <Button size="sm" variant="outline" className="w-full" onClick={handleSellClick}>Sell</Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between px-3 py-1.5 bg-muted/50 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <BarChart3 className="h-3 w-3" />
              <span>Vol: {(stock.volume / 1000).toFixed(1)}K</span>
            </div>
            <div>
              <span className="mr-2">H: {formatCurrency(stock.dayHigh)}</span>
              <span>L: {formatCurrency(stock.dayLow)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
