import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreClient {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface AuthState {
  token: string | null;
  client: StoreClient | null;
}

const initialState: AuthState = {
  token: null,
  client: null,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; client: StoreClient }>) => {
      state.token = action.payload.token;
      state.client = action.payload.client;
    },
    clearAuth: (state) => {
      state.token = null;
      state.client = null;
    },
    updateClientInfo: (state, action: PayloadAction<Partial<StoreClient>>) => {
      if (state.client) {
        state.client = { ...state.client, ...action.payload };
      }
    },
  },
});

export const { setAuth, clearAuth, updateClientInfo } = authSlice.actions;
export default authSlice;
