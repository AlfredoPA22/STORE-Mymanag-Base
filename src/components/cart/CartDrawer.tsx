import { FC, useEffect } from "react";
import { Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartUI } from "../../context/CartUIContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { removeFromCart, updateQuantity } from "../../redux/slices/cartSlice";
import useStockRevalidation from "../../hooks/useStockRevalidation";
import { formatPrice } from "../../utils/currency";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const CartDrawer: FC<{ companySlug: string; companyId: string | null; currency?: string }> = ({
  companySlug,
  companyId,
  currency,
}) => {
  const { isCartOpen, closeCart, openCart } = useCartUI();
  const items = useAppSelector((state) => state.cartSlice.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { revalidate, revalidating } = useStockRevalidation(companyId ?? "");

  useEffect(() => {
    if (isCartOpen) {
      revalidate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCartOpen]);

  const subtotal = items.reduce((acc, item) => acc + item.sale_price * item.quantity, 0);

  const handleCheckout = () => {
    closeCart();
    navigate(`/${companySlug}/checkout`);
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={(open) => (open ? openCart() : closeCart())}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        <SheetHeader className="border-b px-5 py-4 text-left">
          <SheetTitle>Tu carrito</SheetTitle>
        </SheetHeader>

        {revalidating && (
          <div className="flex items-center gap-2 border-b bg-muted/50 px-5 py-2 text-xs text-muted-foreground">
            <Loader2 size={13} className="animate-spin" /> Verificando disponibilidad...
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
              <ShoppingBag size={40} strokeWidth={1.5} />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item, index) => (
              <div key={item.productId}>
                <div className="flex gap-3">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="placeholder-stripes flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="mb-2 text-sm font-bold text-primary-dark">
                      {formatPrice(item.sale_price, currency)}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        disabled={item.quantity <= 1}
                        onClick={() =>
                          dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))
                        }
                      >
                        <Minus size={12} />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7 rounded-full"
                        disabled={item.quantity >= item.stock}
                        onClick={() =>
                          dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))
                        }
                      >
                        <Plus size={12} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        aria-label="Quitar producto"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                {index < items.length - 1 && <Separator className="mt-4" />}
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="space-y-3 border-t px-5 py-4">
            <div className="flex justify-between font-bold text-foreground">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal, currency)}</span>
            </div>
            <Button
              className="w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark"
              onClick={handleCheckout}
            >
              Finalizar compra
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
