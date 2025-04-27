import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth'; // hanya auth

export const store = configureStore({
  reducer: {
    auth: authReducer // define slice dengan nama 'auth'
  },
  devTools: import.meta.env.MODE === 'development'
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
