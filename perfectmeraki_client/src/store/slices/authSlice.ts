import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { UserState } from "../slices/userSlice";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  userDetails: UserState | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  userDetails: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn(
      state,
      action: PayloadAction<{ token: string; userDetails: UserState }>
    ) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.userDetails = action.payload.userDetails;
    },
    signOut(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.userDetails = null;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
