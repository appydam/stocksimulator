
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency, formatNumber, formatPercentage, getColorForChange } from '@/lib/utils';
import { Stock } from '@/data/stocks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/trading/OrderForm';
import { StockDetails } from '@/components/stocks/StockDetails';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';

export function PortfolioOverview() {
  const { state } = useTrading();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Create portfolio items with calculated values
  const portfolioItems = state.holdings.map(holding => {
    const stock = state.stockData.find(s => s.id === holding.stockId);
    if (!stock) return null;

    const currentValue = stock.currentPrice * holding.quantity;
    const pnl = currentValue - holding.investedAmount;
    const pnlPercentage = (pnl / holding.investedAmount) * 100;

    return {
      stock,
      holding,
      currentValue,
      pnl,
      pnlPercentage
    };
  }).filter(item => item !== null) as { 
    stock: Stock;
    holding: typeof state.holdings[0];
    currentValue: number;
    pnl: number;
    pnlPercentage: number;
  }[];

  // Sort by value (high to low)
  portfolioItems.sort((a, b) => b.currentValue - a.currentValue);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Portfolio</h2>
        
        {portfolioItems.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Your portfolio is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start trading to build your portfolio
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium">Stock</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Qty</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Avg. Price</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Cur. Price</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Value</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">P&L</th>
                        <th className="h-12 px-4 text-right align-middle font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                      {portfolioItems.map(item => (
                        <tr key={item.stock.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <td className="p-4 align-middle font-medium">
                            <div>
                              <div className="font-medium">{item.stock.symbol}</div>
                              <div className="text-xs text-muted-foreground">{item.stock.exchange}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-right">{formatNumber(item.holding.quantity, 0)}</td>
                          <td className="p-4 align-middle text-right">{formatCurrency(item.holding.averageBuyPrice)}</td>
                          <td className="p-4 align-middle text-right">{formatCurrency(item.stock.currentPrice)}</td>
                          <td className="p-4 align-middle text-right">{formatCurrency(item.currentValue)}</td>
                          <td className="p-4 align-middle text-right">
                            <div className={getColorForChange(item.pnlPercentage)}>
                              <div className="flex items-center justify-end">
                                {item.pnlPercentage > 0 ? (
                                  <ArrowUpRight className="h-3 w-3 mr-1" />
                                ) : item.pnlPercentage < 0 ? (
                                  <ArrowDownRight className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                )}
                                {formatCurrency(item.pnl)}
                              </div>
                              <div className="text-xs">{formatPercentage(item.pnlPercentage)}</div>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <Button size="sm" onClick={() => handleSelectStock(item.stock)}>Trade</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedStock && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {selectedStock.name} ({selectedStock.symbol})
                </DialogTitle>
                <DialogDescription>
                  {selectedStock.exchange} • {selectedStock.sector}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="trade" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Stock Details</TabsTrigger>
                  <TabsTrigger value="trade">Trade</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 pt-4">
                  <StockDetails stock={selectedStock} />
                </TabsContent>
                <TabsContent value="trade" className="space-y-4 pt-4">
                  <OrderForm stock={selectedStock} onComplete={() => setIsDialogOpen(false)} />
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
