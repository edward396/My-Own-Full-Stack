import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { login, logout, selectUser, selectIsAuthenticated, type User } from './slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticatedValue = useAppSelector(selectIsAuthenticated);

  const loginUser = useCallback((userData: User) => {
    dispatch(login(userData));
  }, [dispatch]);

  const logoutUser = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const isAuthenticated = useCallback(() => {
    return isAuthenticatedValue;
  }, [isAuthenticatedValue]);

  return {
    user,
    login: loginUser,
    logout: logoutUser,
    isAuthenticated,
  };
};