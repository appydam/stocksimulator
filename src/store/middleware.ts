
import { Middleware } from '@reduxjs/toolkit';
import { RootState } from './index';

export const localStorageMiddleware: Middleware = 
  (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState() as RootState;
    
    // Save trading state to localStorage
    localStorage.setItem('tradingState', JSON.stringify(state.trading));
    
    return result;
  };
