import React, { createContext, useContext, useReducer, useEffect } from 'react';
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

type TradingAction =
  | { type: 'PLACE_ORDER'; order: Omit<Order, 'id' | 'createdAt' | 'status'> }
  | { type: 'EXECUTE_ORDER'; orderId: string; executedPrice: number }
  | { type: 'CANCEL_ORDER'; orderId: string }
  | { type: 'ADD_TO_WATCHLIST'; stockId: string }
  | { type: 'REMOVE_FROM_WATCHLIST'; stockId: string }
  | { type: 'UPDATE_STOCK_PRICES' }
  | { type: 'SET_MARKET_STATUS'; isOpen: boolean }
  | { type: 'RESET_PORTFOLIO' };

// Create context
interface TradingContextType {
  state: TradingState;
  placeOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  cancelOrder: (orderId: string) => void;
  addToWatchlist: (stockId: string) => void;
  removeFromWatchlist: (stockId: string) => void;
  resetPortfolio: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

// Initial state from localStorage or default values
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

// Reducer function
function tradingReducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case 'PLACE_ORDER': {
      const newOrder: Order = {
        id: `order-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'PENDING',
        createdAt: new Date(),
        ...action.order,
      };
      return {
        ...state,
        orders: [...state.orders, newOrder],
      };
    }

    case 'EXECUTE_ORDER': {
      const orderIndex = state.orders.findIndex(order => order.id === action.orderId);
      if (orderIndex === -1) return state;

      const order = state.orders[orderIndex];
      const stock = state.stockData.find(s => s.id === order.stockId);
      
      if (!stock) return state;

      const executedPrice = action.executedPrice;
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

      // Update cash, holdings, and orders
      let newCash = state.cash;
      let newHoldings = [...state.holdings];

      if (order.type === 'BUY') {
        // Deduct cash
        newCash -= total;
        
        // Update holdings
        const existingHoldingIndex = newHoldings.findIndex(h => h.stockId === order.stockId);
        
        if (existingHoldingIndex >= 0) {
          // Update existing holding
          const existingHolding = newHoldings[existingHoldingIndex];
          const totalShares = existingHolding.quantity + order.quantity;
          const totalInvestment = existingHolding.investedAmount + total;
          
          newHoldings[existingHoldingIndex] = {
            ...existingHolding,
            quantity: totalShares,
            averageBuyPrice: totalInvestment / totalShares,
            investedAmount: totalInvestment,
          };
        } else {
          // Add new holding
          newHoldings.push({
            stockId: order.stockId,
            stockSymbol: order.stockSymbol,
            quantity: order.quantity,
            averageBuyPrice: executedPrice,
            investedAmount: total,
          });
        }
      } else if (order.type === 'SELL') {
        // Add cash
        newCash += total;
        
        // Update holdings
        const existingHoldingIndex = newHoldings.findIndex(h => h.stockId === order.stockId);
        
        if (existingHoldingIndex >= 0) {
          const existingHolding = newHoldings[existingHoldingIndex];
          const remainingShares = existingHolding.quantity - order.quantity;
          
          if (remainingShares > 0) {
            // Reduce holding
            const remainingInvestment = existingHolding.investedAmount * (remainingShares / existingHolding.quantity);
            
            newHoldings[existingHoldingIndex] = {
              ...existingHolding,
              quantity: remainingShares,
              investedAmount: remainingInvestment,
              // Average buy price stays the same
            };
          } else {
            // Remove holding completely
            newHoldings = newHoldings.filter(h => h.stockId !== order.stockId);
          }
        }
      }

      // Update the order status
      const updatedOrders = [...state.orders];
      updatedOrders[orderIndex] = {
        ...order,
        status: 'EXECUTED',
        executedAt: new Date(),
        executedPrice: executedPrice,
      };

      return {
        ...state,
        cash: newCash,
        holdings: newHoldings,
        transactions: [...state.transactions, transaction],
        orders: updatedOrders,
      };
    }

    case 'CANCEL_ORDER': {
      return {
        ...state,
        orders: state.orders.map(order => 
          order.id === action.orderId 
            ? { ...order, status: 'CANCELED' } 
            : order
        ),
      };
    }

    case 'ADD_TO_WATCHLIST': {
      // Check if already in watchlist
      if (state.watchlist.some(item => item.stockId === action.stockId)) {
        return state;
      }
      
      return {
        ...state,
        watchlist: [
          ...state.watchlist,
          { stockId: action.stockId }
        ],
      };
    }

    case 'REMOVE_FROM_WATCHLIST': {
      return {
        ...state,
        watchlist: state.watchlist.filter(item => item.stockId !== action.stockId),
      };
    }

    case 'UPDATE_STOCK_PRICES': {
      // Simulate price movements
      const updatedStocks = state.stockData.map(stock => {
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
      
      return {
        ...state,
        stockData: updatedStocks,
      };
    }

    // Override SET_MARKET_STATUS to always return true
    case 'SET_MARKET_STATUS': {
      return {
        ...state,
        marketOpen: true, // Always open for demo
      };
    }

    case 'RESET_PORTFOLIO': {
      return {
        ...state,
        cash: initialState.cash,
        holdings: [],
        transactions: [],
        orders: state.orders.filter(order => order.status !== 'PENDING')
          .map(order => ({ ...order, status: 'CANCELED' })),
      };
    }

    default:
      return state;
  }
}

// Provider component
export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(tradingReducer, getInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('tradingState', JSON.stringify(state));
  }, [state]);

  // Process market orders immediately since market is always open
  useEffect(() => {
    state.orders.forEach(order => {
      if (order.status === 'PENDING' && order.orderType === 'MARKET') {
        const stock = state.stockData.find(s => s.id === order.stockId);
        if (stock) {
          dispatch({
            type: 'EXECUTE_ORDER',
            orderId: order.id,
            executedPrice: stock.currentPrice,
          });
          toast({
            title: "Order Executed",
            description: `${order.type} ${order.quantity} ${order.stockSymbol} at ₹${stock.currentPrice.toFixed(2)}`,
          });
        }
      }
    });
  }, [state.orders, state.stockData]);

  // Check limit orders against current prices
  useEffect(() => {
    state.orders.forEach(order => {
      if (order.status === 'PENDING' && order.orderType === 'LIMIT' && order.limitPrice) {
        const stock = state.stockData.find(s => s.id === order.stockId);
        if (stock) {
          const currentPrice = stock.currentPrice;
          
          if ((order.type === 'BUY' && currentPrice <= order.limitPrice) ||
              (order.type === 'SELL' && currentPrice >= order.limitPrice)) {
            dispatch({
              type: 'EXECUTE_ORDER',
              orderId: order.id,
              executedPrice: currentPrice,
            });
            toast({
              title: "Limit Order Executed",
              description: `${order.type} ${order.quantity} ${order.stockSymbol} at ₹${currentPrice.toFixed(2)}`,
            });
          }
        }
      }
    });
  }, [state.stockData]);

  // Simulate stock price updates every 3 seconds
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      dispatch({ type: 'UPDATE_STOCK_PRICES' });
    }, 3000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Provider methods
  const placeOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    // Validate order
    const stock = state.stockData.find(s => s.id === order.stockId);
    if (!stock) {
      toast({
        title: "Order Failed",
        description: "Stock not found",
        variant: "destructive",
      });
      return;
    }

    // For sell orders, check if user has enough shares
    if (order.type === 'SELL') {
      const holding = state.holdings.find(h => h.stockId === order.stockId);
      if (!holding || holding.quantity < order.quantity) {
        toast({
          title: "Order Failed",
          description: "Not enough shares to sell",
          variant: "destructive",
        });
        return;
      }
    }

    // For buy orders, check if user has enough cash
    if (order.type === 'BUY') {
      const estimatedCost = order.quantity * stock.currentPrice;
      if (estimatedCost > state.cash) {
        toast({
          title: "Order Failed",
          description: "Insufficient funds",
          variant: "destructive",
        });
        return;
      }
    }

    dispatch({ type: 'PLACE_ORDER', order });
    
    toast({
      title: "Order Placed",
      description: `${order.type} ${order.quantity} ${order.stockSymbol} at ${order.orderType === 'LIMIT' ? `₹${order.limitPrice}` : 'market price'}`,
    });

    // Execute immediately if it's a market order and market is open
    if (order.orderType === 'MARKET' && state.marketOpen) {
      // This will be handled by the useEffect that processes market orders
    }
  };

  const cancelOrder = (orderId: string) => {
    const order = state.orders.find(o => o.id === orderId);
    if (order && order.status === 'PENDING') {
      dispatch({ type: 'CANCEL_ORDER', orderId });
      toast({
        title: "Order Canceled",
        description: `${order.type} order for ${order.quantity} ${order.stockSymbol} has been canceled`,
      });
    }
  };

  const addToWatchlist = (stockId: string) => {
    dispatch({ type: 'ADD_TO_WATCHLIST', stockId });
    const stock = state.stockData.find(s => s.id === stockId);
    if (stock) {
      toast({
        title: "Added to Watchlist",
        description: `${stock.name} (${stock.symbol}) added to your watchlist`,
      });
    }
  };

  const removeFromWatchlist = (stockId: string) => {
    dispatch({ type: 'REMOVE_FROM_WATCHLIST', stockId });
    const stock = state.stockData.find(s => s.id === stockId);
    if (stock) {
      toast({
        title: "Removed from Watchlist",
        description: `${stock.name} (${stock.symbol}) removed from your watchlist`,
      });
    }
  };

  const resetPortfolio = () => {
    dispatch({ type: 'RESET_PORTFOLIO' });
  };

  return (
    <TradingContext.Provider value={{ 
      state, 
      placeOrder, 
      cancelOrder, 
      addToWatchlist, 
      removeFromWatchlist,
      resetPortfolio 
    }}>
      {children}
    </TradingContext.Provider>
  );
};

// Custom hook to use the trading context
export const useTrading = () => {
  const context = useContext(TradingContext);
  if (context === undefined) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
