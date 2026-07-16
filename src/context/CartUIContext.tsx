import { createContext, FC, ReactNode, useContext, useState } from "react";

interface CartUIContextValue {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartUIContext = createContext<CartUIContextValue | undefined>(undefined);

export const CartUIProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartUIContext.Provider
      value={{
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartUIContext.Provider>
  );
};

export const useCartUI = () => {
  const ctx = useContext(CartUIContext);
  if (!ctx) throw new Error("useCartUI debe usarse dentro de CartUIProvider");
  return ctx;
};
