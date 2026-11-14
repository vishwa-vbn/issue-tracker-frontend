import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  sidebarOpen: boolean;
  serverWaking: boolean;
}

const initialState: UiState = {
  sidebarOpen: false,
  serverWaking: false,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setServerWaking: (state, action: PayloadAction<boolean>) => {
      state.serverWaking = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, setServerWaking } = uiSlice.actions;
export default uiSlice.reducer;

