
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { executeOrder, updateStockPrices } from '@/store/tradingSlice';
import { toast } from '@/components/ui/use-toast';

export function ReduxUpdater() {
  const dispatch = useAppDispatch();
  const { orders, stockData, marketOpen } = useAppSelector(state => state.trading);
  
  // Simulate stock price updates every 3 seconds
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      dispatch(updateStockPrices());
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  // Process market orders immediately
  useEffect(() => {
    orders.forEach(order => {
      if (order.status === 'PENDING' && order.orderType === 'MARKET' && marketOpen) {
        const stock = stockData.find(s => s.id === order.stockId);
        if (stock) {
          dispatch(executeOrder({
            orderId: order.id,
            executedPrice: stock.currentPrice
          }));
          
          toast({
            title: "Order Executed",
            description: `${order.type} ${order.quantity} ${order.stockSymbol} at ${stock.currentPrice.toFixed(2)}`,
          });
        }
      }
    });
  }, [orders, stockData, marketOpen, dispatch]);

  // Check limit orders against current prices
  useEffect(() => {
    orders.forEach(order => {
      if (order.status === 'PENDING' && order.orderType === 'LIMIT' && order.limitPrice) {
        const stock = stockData.find(s => s.id === order.stockId);
        if (stock) {
          const currentPrice = stock.currentPrice;
          
          if ((order.type === 'BUY' && currentPrice <= order.limitPrice) ||
              (order.type === 'SELL' && currentPrice >= order.limitPrice)) {
            dispatch(executeOrder({
              orderId: order.id,
              executedPrice: currentPrice
            }));
            
            toast({
              title: "Limit Order Executed",
              description: `${order.type} ${order.quantity} ${order.stockSymbol} at ${currentPrice.toFixed(2)}`,
            });
          }
        }
      }
    });
  }, [stockData, orders, dispatch]);

  // We need to add this component to App.tsx
  return null;
}
