
import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PortfolioOverview } from '@/components/dashboard/PortfolioOverview';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, BarChart3, DollarSign, PieChart } from 'lucide-react';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency, formatPercentage, getColorForChange } from '@/lib/utils';

export default function PortfolioPage() {
  const { state } = useTrading();
  const { cash, holdings, stockData } = state;
  
  // Calculate portfolio value
  const portfolioValue = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    return total + (stock ? stock.currentPrice * holding.quantity : 0);
  }, 0);
  
  // Calculate total account value
  const totalValue = cash + portfolioValue;
  
  // Calculate invested amount
  const investedAmount = holdings.reduce((total, holding) => total + holding.investedAmount, 0);
  
  // Calculate unrealized P&L
  const unrealizedPnL = holdings.reduce((total, holding) => {
    const stock = stockData.find(s => s.id === holding.stockId);
    const currentValue = stock ? stock.currentPrice * holding.quantity : 0;
    return total + (currentValue - holding.investedAmount);
  }, 0);
  
  // Calculate P&L percentage
  const pnlPercentage = investedAmount > 0 ? (unrealizedPnL / investedAmount) * 100 : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">Portfolio</h1>
          <p className="text-muted-foreground">Track your investments and performance</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-card hover:shadow-md transition-shadow">
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
          
          <Card className="bg-card hover:shadow-md transition-shadow">
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
          
          <Card className="bg-card hover:shadow-md transition-shadow">
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
          
          <Card className="bg-card hover:shadow-md transition-shadow">
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
                  <ArrowDownRight className="h-3 w-3 mr-1 text-muted-foreground" />
                )}
                {formatPercentage(pnlPercentage)}
              </p>
            </CardContent>
          </Card>
        </div>
        
        <PortfolioOverview />
      </div>
    </AppLayout>
  );
}
