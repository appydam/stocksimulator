
import { configureStore } from '@reduxjs/toolkit';
import tradingReducer from './tradingSlice';
import userReducer from './userSlice';
import { localStorageMiddleware } from './middleware';

export const store = configureStore({
  reducer: {
    trading: tradingReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the specified action types
        ignoredActions: ['trading/placeOrder', 'trading/executeOrder'],
        // Ignore these field paths in the state
        ignoredPaths: [
          'trading.orders',
          'trading.transactions'
        ],
      },
    }).concat(localStorageMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
