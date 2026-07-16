import { FC } from "react";
import { Link, useParams } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { IStoreProduct } from "../../utils/interfaces/StoreProduct";
import { useAppDispatch } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import { useCartUI } from "../../context/CartUIContext";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import StockBadge from "./StockBadge";

interface ProductCardProps {
  product: IStoreProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { openCart } = useCartUI();
  const { companySlug } = useParams();
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;
    dispatch(
      addToCart({
        item: {
          productId: product._id,
          name: product.name,
          image: product.image,
          sale_price: product.sale_price,
          stock: product.stock,
        },
        quantity: 1,
      })
    );
    toast.success(`${product.name} agregado al carrito`);
    openCart();
  };

  const hasDiscount =
    product.regular_price != null && product.regular_price > product.sale_price;
  const discountPercent = hasDiscount
    ? Math.round((1 - product.sale_price / (product.regular_price as number)) * 100)
    : 0;

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg">
      <Link
        to={`/${companySlug}/producto/${product._id}`}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {hasDiscount && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
            -{discountPercent}%
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="placeholder-stripes flex h-full w-full items-center justify-center font-mono text-xs text-muted-foreground">
            Sin imagen
          </div>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col p-4">
        {product.category?.name && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-light">
            {product.category.name}
          </p>
        )}

        <Link to={`/${companySlug}/producto/${product._id}`}>
          <h3 className="mb-2 line-clamp-2 font-display font-bold leading-snug text-foreground transition-colors hover:text-primary-dark">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-foreground">
                Bs {product.sale_price.toFixed(2)}
              </span>
              {product.regular_price != null && product.regular_price > product.sale_price && (
                <span className="text-xs text-muted-foreground line-through">
                  Bs {product.regular_price.toFixed(2)}
                </span>
              )}
            </div>
            <StockBadge stock={product.stock} />
          </div>

          <Button
            className="w-full rounded-full bg-primary font-semibold text-primary-foreground hover:bg-primary-dark disabled:bg-muted disabled:text-muted-foreground"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} />
            {outOfStock ? "Agotado" : "Agregar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
