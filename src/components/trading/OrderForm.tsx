
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stock } from '@/data/stocks';
import { useTrading } from '@/contexts/TradingContext';
import { formatCurrency } from '@/lib/utils';

interface OrderFormProps {
  stock: Stock;
  onComplete: () => void;
}

type OrderFormData = {
  quantity: string;
  limitPrice?: string;
};

export function OrderForm({ stock, onComplete }: OrderFormProps) {
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET');
  const [buyForm] = useForm<OrderFormData>();
  const [sellForm] = useForm<OrderFormData>();
  const { state, placeOrder } = useTrading();
  
  // Get current holding for this stock if any
  const holding = state.holdings.find(h => h.stockId === stock.id);
  const holdingQuantity = holding ? holding.quantity : 0;
  
  const handleBuySubmit = buyForm.handleSubmit((data) => {
    const quantity = parseInt(data.quantity);
    if (isNaN(quantity) || quantity <= 0) return;
    
    placeOrder({
      type: 'BUY',
      orderType,
      stockId: stock.id,
      stockSymbol: stock.symbol,
      quantity,
      limitPrice: orderType === 'LIMIT' ? parseFloat(data.limitPrice || '0') : undefined,
    });
    
    onComplete();
  });
  
  const handleSellSubmit = sellForm.handleSubmit((data) => {
    const quantity = parseInt(data.quantity);
    if (isNaN(quantity) || quantity <= 0 || quantity > holdingQuantity) return;
    
    placeOrder({
      type: 'SELL',
      orderType,
      stockId: stock.id,
      stockSymbol: stock.symbol,
      quantity,
      limitPrice: orderType === 'LIMIT' ? parseFloat(data.limitPrice || '0') : undefined,
    });
    
    onComplete();
  });

  // Calculate estimated cost/proceeds
  const buyQuantity = parseInt(buyForm.watch('quantity') || '0');
  const sellQuantity = parseInt(sellForm.watch('quantity') || '0');
  
  const estimatedBuyCost = !isNaN(buyQuantity) ? buyQuantity * stock.currentPrice : 0;
  const estimatedSellProceeds = !isNaN(sellQuantity) ? sellQuantity * stock.currentPrice : 0;

  return (
    <Tabs defaultValue="buy" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="buy">Buy</TabsTrigger>
        <TabsTrigger value="sell">Sell</TabsTrigger>
      </TabsList>
      
      <TabsContent value="buy">
        <form onSubmit={handleBuySubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="buy-quantity">Quantity</Label>
            <Input
              id="buy-quantity"
              type="number"
              placeholder="Enter quantity"
              min="1"
              step="1"
              {...buyForm.register('quantity', { required: true })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Order Type</Label>
            <RadioGroup 
              defaultValue="MARKET" 
              onValueChange={(value) => setOrderType(value as 'MARKET' | 'LIMIT')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MARKET" id="buy-market" />
                <Label htmlFor="buy-market">Market Order</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LIMIT" id="buy-limit" />
                <Label htmlFor="buy-limit">Limit Order</Label>
              </div>
            </RadioGroup>
          </div>
          
          {orderType === 'LIMIT' && (
            <div className="grid gap-2">
              <Label htmlFor="buy-limit-price">Limit Price</Label>
              <Input
                id="buy-limit-price"
                type="number"
                placeholder="Enter price"
                step="0.01"
                defaultValue={stock.currentPrice.toString()}
                {...buyForm.register('limitPrice', { required: orderType === 'LIMIT' })}
              />
            </div>
          )}
          
          <div className="text-sm">
            <div className="flex justify-between py-2 border-t">
              <span>Current Price:</span>
              <span>{formatCurrency(stock.currentPrice)}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span>Estimated Cost:</span>
              <span>{formatCurrency(estimatedBuyCost)}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span>Available Cash:</span>
              <span>{formatCurrency(state.cash)}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              !state.marketOpen && orderType === 'MARKET' || 
              estimatedBuyCost > state.cash
            }
          >
            Place Buy Order
          </Button>
          
          {!state.marketOpen && orderType === 'MARKET' && (
            <p className="text-xs text-destructive text-center">
              Market orders can only be placed when the market is open.
            </p>
          )}
          {estimatedBuyCost > state.cash && (
            <p className="text-xs text-destructive text-center">
              Insufficient funds for this order.
            </p>
          )}
        </form>
      </TabsContent>
      
      <TabsContent value="sell">
        <form onSubmit={handleSellSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="sell-quantity">Quantity</Label>
            <Input
              id="sell-quantity"
              type="number"
              placeholder="Enter quantity"
              min="1"
              max={holdingQuantity.toString()}
              step="1"
              {...sellForm.register('quantity', { required: true })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label>Order Type</Label>
            <RadioGroup 
              defaultValue="MARKET" 
              onValueChange={(value) => setOrderType(value as 'MARKET' | 'LIMIT')}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="MARKET" id="sell-market" />
                <Label htmlFor="sell-market">Market Order</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="LIMIT" id="sell-limit" />
                <Label htmlFor="sell-limit">Limit Order</Label>
              </div>
            </RadioGroup>
          </div>
          
          {orderType === 'LIMIT' && (
            <div className="grid gap-2">
              <Label htmlFor="sell-limit-price">Limit Price</Label>
              <Input
                id="sell-limit-price"
                type="number"
                placeholder="Enter price"
                step="0.01"
                defaultValue={stock.currentPrice.toString()}
                {...sellForm.register('limitPrice', { required: orderType === 'LIMIT' })}
              />
            </div>
          )}
          
          <div className="text-sm">
            <div className="flex justify-between py-2 border-t">
              <span>Current Price:</span>
              <span>{formatCurrency(stock.currentPrice)}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span>Estimated Proceeds:</span>
              <span>{formatCurrency(estimatedSellProceeds)}</span>
            </div>
            <div className="flex justify-between py-2 border-t">
              <span>Shares Owned:</span>
              <span>{holdingQuantity}</span>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={
              !state.marketOpen && orderType === 'MARKET' ||
              holdingQuantity === 0 ||
              (sellForm.watch('quantity') && parseInt(sellForm.watch('quantity')) > holdingQuantity)
            }
          >
            Place Sell Order
          </Button>
          
          {!state.marketOpen && orderType === 'MARKET' && (
            <p className="text-xs text-destructive text-center">
              Market orders can only be placed when the market is open.
            </p>
          )}
          {holdingQuantity === 0 && (
            <p className="text-xs text-destructive text-center">
              You don't own any shares of this stock.
            </p>
          )}
          {sellForm.watch('quantity') && parseInt(sellForm.watch('quantity')) > holdingQuantity && (
            <p className="text-xs text-destructive text-center">
              You can't sell more shares than you own.
            </p>
          )}
        </form>
      </TabsContent>
    </Tabs>
  );
}
