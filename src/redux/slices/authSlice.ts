import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoreClient {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
}

interface SavedSession {
  token: string;
  client: StoreClient;
}

interface AuthState {
  companyId: string | null;
  token: string | null;
  client: StoreClient | null;
  // Sesión de cada tienda donde el cliente inició sesión, guardada mientras
  // se navega por otra, para restaurarla al volver sin pedir login de nuevo.
  savedByCompany: Record<string, SavedSession>;
}

const initialState: AuthState = {
  companyId: null,
  token: null,
  client: null,
  savedByCompany: {},
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{ token: string; client: StoreClient; companyId: string }>
    ) => {
      const { token, client, companyId } = action.payload;
      state.token = token;
      state.client = client;
      state.companyId = companyId;
      state.savedByCompany[companyId] = { token, client };
    },
    clearAuth: (state) => {
      state.token = null;
      state.client = null;
      if (state.companyId) {
        delete state.savedByCompany[state.companyId];
      }
    },
    switchCompany: (state, action: PayloadAction<string>) => {
      const nextCompanyId = action.payload;
      if (state.companyId === nextCompanyId) return;

      if (state.companyId) {
        if (state.token && state.client) {
          state.savedByCompany[state.companyId] = { token: state.token, client: state.client };
        } else {
          delete state.savedByCompany[state.companyId];
        }
      }

      const saved = state.savedByCompany[nextCompanyId];
      state.token = saved?.token ?? null;
      state.client = saved?.client ?? null;
      state.companyId = nextCompanyId;
    },
    updateClientInfo: (state, action: PayloadAction<Partial<StoreClient>>) => {
      if (state.client) {
        state.client = { ...state.client, ...action.payload };
        if (state.companyId && state.savedByCompany[state.companyId]) {
          state.savedByCompany[state.companyId].client = state.client;
        }
      }
    },
  },
});

export const { setAuth, clearAuth, switchCompany, updateClientInfo } = authSlice.actions;
export default authSlice;
