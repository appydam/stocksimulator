
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { StockCard } from '@/components/stocks/StockCard';
import { useTrading } from '@/contexts/TradingContext';
import { Stock } from '@/data/stocks';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderForm } from '@/components/trading/OrderForm';
import { StockDetails } from '@/components/stocks/StockDetails';

export function MarketOverview() {
  const { state } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const filteredStocks = state.stockData.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectStock = (stock: Stock) => {
    setSelectedStock(stock);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">Market Overview</h2>
          <Input 
            placeholder="Search stocks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStocks.map(stock => (
            <StockCard 
              key={stock.id} 
              stock={stock} 
              onSelect={handleSelectStock}
            />
          ))}
        </div>
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
              
              <Tabs defaultValue="details" className="mt-4">
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
