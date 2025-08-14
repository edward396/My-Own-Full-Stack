import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../../data/products';
import { fetchCartApi, syncCartApi } from '../../api';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSync: boolean;
  lastSynced?: string;
  error?: string;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSync: false,
  lastSynced: undefined,
  error: undefined,
};

// Async thunks for API calls
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string) => {
    const response = await fetchCartApi(userId);
    return response;
  }
);

export const syncCart = createAsyncThunk(
  'cart/syncCart',
  async ({ userId, items }: { userId: string; items: CartItem[] }) => {
    const response = await syncCartApi(userId, items);
    return response;
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<{ product: Product; quantity?: number }>) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ product, quantity });
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.product.id !== productId);
        return;
      }

      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.error = undefined;
    },
    setSyncStatus: (state, action: PayloadAction<boolean>) => {
      state.isSync = action.payload;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart cases
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.lastSynced = action.payload.lastUpdated;
        state.isSync = true;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })
      // Sync cart cases
      .addCase(syncCart.pending, (state) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lastSynced = action.payload.lastUpdated;
        state.isSync = true;
      })
      .addCase(syncCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to sync cart';
        state.isSync = false;
      });
  },
});

export const { addItem, removeItem, updateQuantity, clearCart, setSyncStatus, clearError } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.isLoading;
export const selectCartSync = (state: { cart: CartState }) => state.cart.isSync;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartLastSynced = (state: { cart: CartState }) => state.cart.lastSynced;

export const selectTotalItems = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectTotalPrice = (state: { cart: CartState }) => 
  state.cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

export default cartSlice.reducer;