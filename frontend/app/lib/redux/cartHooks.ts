import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { 
  addItem, 
  removeItem, 
  updateQuantity, 
  clearCart,
  fetchCart,
  syncCart,
  setSyncStatus,
  clearError,
  selectCartItems,
  selectCartLoading,
  selectCartSync,
  selectCartError,
  selectCartLastSynced,
  selectTotalItems,
  selectTotalPrice,
  type CartItem 
} from './slices/cartSlice';
import { selectUser } from './slices/authSlice';
import type { Product } from '../data/products';
import { toast } from 'sonner';

export const useCart = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const items = useAppSelector(selectCartItems);
  const isLoading = useAppSelector(selectCartLoading);
  const isSync = useAppSelector(selectCartSync);
  const error = useAppSelector(selectCartError);
  const lastSynced = useAppSelector(selectCartLastSynced);
  const totalItems = useAppSelector(selectTotalItems);
  const totalPrice = useAppSelector(selectTotalPrice);

  // Auto-sync cart changes after modifications
  const syncCartChanges = useCallback(async () => {
    if (user && items.length >= 0) {
      try {
        await dispatch(syncCart({ userId: user.id, items })).unwrap();
      } catch (error) {
        console.error('Failed to sync cart:', error);
        toast.error('Failed to sync cart changes');
      }
    }
  }, [user, items, dispatch]);

  // Auto-sync cart when user logs in - but only if local cart is empty
  useEffect(() => {
    if (user && !isSync && items.length === 0) {
      dispatch(fetchCart(user.id)).catch((error) => {
        console.error('Failed to fetch cart:', error);
      });
    } else if (user && !isSync && items.length > 0) {
      // If we have local items, sync them to server instead of fetching
      syncCartChanges();
    }
  }, [user, isSync, dispatch, items.length, syncCartChanges]);

  const addItemToCart = useCallback((product: Product, quantity: number = 1) => {
    dispatch(addItem({ product, quantity }));
    dispatch(setSyncStatus(false));
    // Sync immediately for add operations to prevent issues
    if (user) {
      syncCartChanges();
    }
  }, [dispatch, syncCartChanges, user]);

  const removeItemFromCart = useCallback((productId: string) => {
    dispatch(removeItem(productId));
    dispatch(setSyncStatus(false));
    if (user) {
      syncCartChanges();
    }
  }, [dispatch, syncCartChanges, user]);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
    dispatch(setSyncStatus(false));
    if (user) {
      syncCartChanges();
    }
  }, [dispatch, syncCartChanges, user]);

  const clearCartItems = useCallback(() => {
    dispatch(clearCart());
    if (user) {
      syncCartChanges();
    }
  }, [dispatch, syncCartChanges, user]);

  const forceSync = useCallback(async () => {
    if (user) {
      try {
        await dispatch(fetchCart(user.id)).unwrap();
        toast.success('Cart synced successfully');
      } catch (error) {
        toast.error('Failed to sync cart');
      }
    }
  }, [user, dispatch]);

  const getTotalItems = useCallback(() => {
    return totalItems;
  }, [totalItems]);

  const getTotalPrice = useCallback(() => {
    return totalPrice;
  }, [totalPrice]);

  return {
    items,
    isLoading,
    isSync,
    error,
    lastSynced,
    addItem: addItemToCart,
    removeItem: removeItemFromCart,
    updateQuantity: updateItemQuantity,
    clearCart: clearCartItems,
    forceSync,
    getTotalItems,
    getTotalPrice,
  };
};