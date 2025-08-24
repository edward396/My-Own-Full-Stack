import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Role = "customer" | "vendor" | "shipper";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  profile_picture: string | null;
  role: Role;
  // Customer-specific fields
  name?: string;
  address?: string;
  // Vendor-specific fields
  business_name?: string;
  business_address?: string;
  businessName?: string; // Keep for backward compatibility
  // Shipper-specific fields
  hub_id?: string;
  distributionHub?: string; // Keep for backward compatibility
  // Additional frontend fields
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

// Selectors
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.user !== null;

export default authSlice.reducer;
