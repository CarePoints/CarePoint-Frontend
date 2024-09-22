import { configureStore } from '@reduxjs/toolkit';
import searchReducer from './yourSlice'; 
import cartSlice from './cartSlice';
const store = configureStore({
  reducer: {
    search: searchReducer, 
    cart: cartSlice 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
