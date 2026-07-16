import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  sale_price: number;
  stock: number;
  quantity: number;
}

interface CartState {
  companyId: string | null;
  items: CartItem[];
  // Carrito de cada tienda donde el cliente inició sesión, guardado mientras
  // se navega por otra, para restaurarlo tal cual al volver sin perderlo.
  savedByCompany: Record<string, CartItem[]>;
}

const initialState: CartState = {
  companyId: null,
  items: [],
  savedByCompany: {},
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
    switchCompany: (state, action: PayloadAction<string>) => {
      const nextCompanyId = action.payload;
      if (state.companyId === nextCompanyId) return;

      if (state.companyId) {
        state.savedByCompany[state.companyId] = state.items;
      }

      state.items = state.savedByCompany[nextCompanyId] ?? [];
      state.companyId = nextCompanyId;
    },
    addToCart: (state, action: PayloadAction<{ item: Omit<CartItem, "quantity">; quantity: number }>) => {
      const { item, quantity } = action.payload;
      const existing = state.items.find((i) => i.productId === item.productId);
      const maxQuantity = item.stock > 0 ? item.stock : 0;

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxQuantity);
      } else {
        state.items.push({ ...item, quantity: Math.min(quantity, maxQuantity) });
      }
    },
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((i) => i.productId === action.payload.productId);
      if (item) {
        item.quantity = Math.max(1, Math.min(action.payload.quantity, item.stock));
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      if (state.companyId) {
        delete state.savedByCompany[state.companyId];
      }
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { switchCompany, addToCart, updateQuantity, removeFromCart, clearCart, setCart } =
  cartSlice.actions;
export default cartSlice;
