import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
};

export type AuthStatus = 'unknown' | 'authed' | 'guest';

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  status: 'unknown',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signedIn: (
      _state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ): AuthState => ({
      user: action.payload.user,
      accessToken: action.payload.accessToken,
      status: 'authed',
    }),
    tokenRefreshed: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.status = 'authed';
    },
    sessionExpired: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'guest';
    },
    signedOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.status = 'guest';
    },
  },
});

export const { signedIn, tokenRefreshed, sessionExpired, signedOut } = authSlice.actions;
export default authSlice.reducer;
