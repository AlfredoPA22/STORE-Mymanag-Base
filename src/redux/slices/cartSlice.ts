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
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cartSlice",
  initialState,
  reducers: {
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
    },
    setCart: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice;
