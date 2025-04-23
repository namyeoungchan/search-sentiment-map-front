import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { sentimentReducer } from './slices/sentimentSlice';

export const store = configureStore({
  reducer: {
    sentiment: sentimentReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware().concat(logger),
  devTools: import.meta.env.MODE !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;