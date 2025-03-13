import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, DollarSign, PieChart } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency, formatPercentage, getColorForChange } from '@/lib/utils';
import { MarketOverview } from './MarketOverview';
import { WatchlistOverview } from './WatchlistOverview';
import { PortfolioOverview } from './PortfolioOverview';
import { Leaderboard } from './Leaderboard';

export function Dashboard() {
  const { state } = useTrading();
  const { cash, holdings, stockData } = state;
  
  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    return total + (stock ? stock.currentPrice * holding.quantity : 0);
  }, 0);
  
  const totalValue = cash + portfolioValue;
  
  const investedAmount = holdings.reduce((total, holding) => total + holding.investedAmount, 0);
  
  const unrealizedPnL = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    const currentValue = stock ? stock.currentPrice * holding.quantity : 0;
    return total + (currentValue - holding.investedAmount);
  }, 0);
  
  const pnlPercentage = investedAmount > 0 ? (unrealizedPnL / investedAmount) * 100 : 0;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalValue)}</div>
            <p className="text-xs text-muted-foreground">
              Cash + Portfolio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cash)}</div>
            <p className="text-xs text-muted-foreground">
              {((cash / totalValue) * 100).toFixed(2)}% of portfolio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invested Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(portfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              {((portfolioValue / totalValue) * 100).toFixed(2)}% of portfolio
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unrealized P&L</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getColorForChange(pnlPercentage)}`}>
              {formatCurrency(unrealizedPnL)}
            </div>
            <p className={`text-xs flex items-center ${getColorForChange(pnlPercentage)}`}>
              {pnlPercentage > 0 ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : pnlPercentage < 0 ? (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              ) : (
                <TrendingUp className="h-3 w-3 mr-1" />
              )}
              {formatPercentage(pnlPercentage)}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="market" className="space-y-4">
            <TabsList>
              <TabsTrigger value="market">Market Overview</TabsTrigger>
              <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>
            <TabsContent value="market" className="space-y-4">
              <MarketOverview />
            </TabsContent>
            <TabsContent value="watchlist" className="space-y-4">
              <WatchlistOverview />
            </TabsContent>
            <TabsContent value="portfolio" className="space-y-4">
              <PortfolioOverview />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
