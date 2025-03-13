
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StockCard } from '@/components/stocks/StockCard';
import { useTrading } from '@/contexts/TradingContext';
import { Stock } from '@/data/stocks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/trading/OrderForm';
import { StockDetails } from '@/components/stocks/StockDetails';
import { PriceAlerts } from '@/components/trading/PriceAlerts';

export function WatchlistOverview() {
  const { state } = useTrading();
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const watchlistStocks = state.watchlist
    .map(item => state.stockData.find(stock => stock.id === item.stockId))
    .filter((stock): stock is Stock => !!stock);

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">My Watchlist</h2>
        
        {watchlistStocks.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <div className="text-center">
                <p className="text-muted-foreground">Your watchlist is empty</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Add stocks to your watchlist by clicking the star icon
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {watchlistStocks.map(stock => (
              <StockCard 
                key={stock.id} 
                stock={stock} 
                onSelect={handleSelectStock}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[650px]">
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
              
              <Tabs defaultValue="details" className="mt-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="details">Stock Details</TabsTrigger>
                  <TabsTrigger value="trade">Trade</TabsTrigger>
                  <TabsTrigger value="alerts">Price Alerts</TabsTrigger>
                </TabsList>
                <div className="tabs-content-fixed-height">
                  <TabsContent value="details" className="space-y-4 pt-4">
                    <StockDetails stock={selectedStock} />
                  </TabsContent>
                  <TabsContent value="trade" className="space-y-4 pt-4">
                    <OrderForm stock={selectedStock} onComplete={() => setIsDialogOpen(false)} />
                  </TabsContent>
                  <TabsContent value="alerts" className="space-y-4 pt-4">
                    <PriceAlerts stock={selectedStock} />
                  </TabsContent>
                </div>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
