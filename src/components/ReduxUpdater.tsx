
import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { executeOrder, updateStockPrices } from '@/store/tradingSlice';
import { toast } from '@/components/ui/use-toast';

export function ReduxUpdater() {
  const dispatch = useAppDispatch();

  // Simulate stock price updates every 3 seconds
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      dispatch(updateStockPrices());
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [dispatch]);

  // We need to add this component to App.tsx
  return null;
}
