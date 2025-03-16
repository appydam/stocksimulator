
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stocks, Stock } from '../data/stocks';
import { toast } from '@/components/ui/use-toast';

// Define types
export interface Transaction {
  id: string;
  type: 'BUY' | 'SELL';
  stockId: string;
  stockSymbol: string;
  quantity: number;
  price: number;
  timestamp: Date;
  total: number;
}

export interface StockHolding {
  stockId: string;
  stockSymbol: string;
  quantity: number;
  averageBuyPrice: number;
  investedAmount: number;
}

export interface WatchlistItem {
  stockId: string;
}

export interface Order {
  id: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  stockId: string;
  stockSymbol: string;
  quantity: number;
  limitPrice?: number;
  status: 'PENDING' | 'EXECUTED' | 'CANCELED';
  createdAt: Date;
  executedAt?: Date;
  executedPrice?: number;
}

interface TradingState {
  cash: number;
  holdings: StockHolding[];
  watchlist: WatchlistItem[];
  transactions: Transaction[];
  orders: Order[];
  stockData: Stock[];
  marketOpen: boolean;
}

// Get initial state from localStorage or default values
const getInitialState = (): TradingState => {
  const savedState = localStorage.getItem('tradingState');
  if (savedState) {
    const parsed = JSON.parse(savedState);
    // Convert date strings back to Date objects
    return {
      ...parsed,
      orders: parsed.orders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        executedAt: order.executedAt ? new Date(order.executedAt) : undefined,
      })),
      transactions: parsed.transactions.map((transaction: any) => ({
        ...transaction,
        timestamp: new Date(transaction.timestamp),
      })),
    };
  }
  return {
    cash: 1000000, // ₹10,00,000
    holdings: [],
    watchlist: [],
    transactions: [],
    orders: [],
    stockData: stocks,
    marketOpen: true, // Always open for demo
  };
};

export const tradingSlice = createSlice({
  name: 'trading',
  initialState: getInitialState(),
  reducers: {
    placeOrder: (state, action: PayloadAction<Omit<Order, 'id' | 'createdAt' | 'status'>>) => {
      const newOrder: Order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'PENDING',
        createdAt: new Date(),
        ...action.payload,
      };
      state.orders.push(newOrder);
    },
    executeOrder: (state, action: PayloadAction<{ orderId: string; executedPrice: number }>) => {
      const { orderId, executedPrice } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      if (orderIndex === -1) return;

      const order = state.orders[orderIndex];
      const stock = state.stockData.find(s => s.id === order.stockId);
      
      if (!stock) return;

      const total = order.quantity * executedPrice;
      
      // Create new transaction
      const transaction: Transaction = {
        id: `txn-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        type: order.type,
        stockId: order.stockId,
        stockSymbol: order.stockSymbol,
        quantity: order.quantity,
        price: executedPrice,
        timestamp: new Date(),
        total: total,
      };

      if (order.type === 'BUY') {
        // Deduct cash
        state.cash -= total;
        
        // Update holdings
        const existingHoldingIndex = state.holdings.findIndex(h => h.stockId === order.stockId);
        
        if (existingHoldingIndex >= 0) {
          // Update existing holding
          const existingHolding = state.holdings[existingHoldingIndex];
          const totalShares = existingHolding.quantity + order.quantity;
          const totalInvestment = existingHolding.investedAmount + total;
          
          state.holdings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: totalShares,
            averageBuyPrice: totalInvestment / totalShares,
            investedAmount: totalInvestment,
          };
        } else {
          // Add new holding
          state.holdings.push({
            stockId: order.stockId,
            stockSymbol: order.stockSymbol,
            quantity: order.quantity,
            averageBuyPrice: executedPrice,
            investedAmount: total,
          });
        }
      } else if (order.type === 'SELL') {
        // Add cash
        state.cash += total;
        
        // Update holdings
        const existingHoldingIndex = state.holdings.findIndex(h => h.stockId === order.stockId);
        
        if (existingHoldingIndex >= 0) {
          const existingHolding = state.holdings[existingHoldingIndex];
          const remainingShares = existingHolding.quantity - order.quantity;
          
          if (remainingShares > 0) {
            // Reduce holding
            const remainingInvestment = existingHolding.investedAmount * (remainingShares / existingHolding.quantity);
            
            state.holdings[existingHoldingIndex] = {
              ...existingHolding,
              quantity: remainingShares,
              investedAmount: remainingInvestment,
              // Average buy price stays the same
            };
          } else {
            // Remove holding completely
            state.holdings = state.holdings.filter(h => h.stockId !== order.stockId);
          }
        }
      }

      // Update the order status
      state.orders[orderIndex] = {
        ...order,
        status: 'EXECUTED',
        executedAt: new Date(),
        executedPrice: executedPrice,
      };

      // Add transaction
      state.transactions.push(transaction);
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const orderId = action.payload;
      state.orders = state.orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'CANCELED' } 
          : order
      );
    },
    addToWatchlist: (state, action: PayloadAction<string>) => {
      const stockId = action.payload;
      // Check if already in watchlist
      if (state.watchlist.some(item => item.stockId === stockId)) {
        return;
      }
      
      state.watchlist.push({ stockId });
    },
    removeFromWatchlist: (state, action: PayloadAction<string>) => {
      const stockId = action.payload;
      state.watchlist = state.watchlist.filter(item => item.stockId !== stockId);
    },
    updateStockPrices: (state) => {
      // Simulate price movements
      state.stockData = state.stockData.map(stock => {
        // Random price change between -1.5% and +1.5%
        const changePercent = (Math.random() * 3 - 1.5) / 100;
        const newPrice = parseFloat((stock.currentPrice * (1 + changePercent)).toFixed(2));
        
        // Ensure price doesn't go below 0
        const finalPrice = Math.max(newPrice, 0.01);
        
        const change = finalPrice - stock.previousClose;
        const changePercent2 = (change / stock.previousClose) * 100;
        
        return {
          ...stock,
          currentPrice: finalPrice,
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent2.toFixed(2)),
          dayHigh: Math.max(stock.dayHigh, finalPrice),
          dayLow: Math.min(stock.dayLow, finalPrice),
        };
      });
    },
    setMarketStatus: (state, action: PayloadAction<boolean>) => {
      state.marketOpen = true; // Always open for demo
    },
    resetPortfolio: (state) => {
      state.cash = 1000000;
      state.holdings = [];
      state.transactions = [];
      state.orders = state.orders
        .filter(order => order.status !== 'PENDING')
        .map(order => ({ ...order, status: 'CANCELED' }));
    }
  }
});

export const { 
  placeOrder, 
  executeOrder, 
  cancelOrder, 
  addToWatchlist, 
  removeFromWatchlist, 
  updateStockPrices, 
  setMarketStatus, 
  resetPortfolio 
} = tradingSlice.actions;

export default tradingSlice.reducer;
