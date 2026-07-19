import { FC } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { IStoreProduct } from "../../utils/interfaces/StoreProduct";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import { useCartUI } from "../../context/CartUIContext";
import { StoreOutletContext } from "../layout/CompanyLayout";
import { formatPrice } from "../../utils/currency";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import ImagePlaceholder from "./ImagePlaceholder";
import StockBadge from "./StockBadge";

const MotionCard = motion(Card);

interface ProductCardProps {
  product: IStoreProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const dispatch = useAppDispatch();
  const { openCart } = useCartUI();
  const { companySlug } = useParams();
  const { company } = useOutletContext<StoreOutletContext>();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((state) => !!state.authSlice.token);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (outOfStock) return;

    if (!isAuthenticated) {
      toast.info("Inicia sesión o crea una cuenta para agregar al carrito");
      navigate(`/${companySlug}/login`, {
        state: { from: `/${companySlug}/producto/${product._id}` },
      });
      return;
    }

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
    <MotionCard
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="group flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
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
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder iconSize={28} label="Sin imagen" />
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col p-4">
        {product.category?.name && (
          <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-primary-dark">
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
                {formatPrice(product.sale_price, company?.currency)}
              </span>
              {product.regular_price != null && product.regular_price > product.sale_price && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.regular_price, company?.currency)}
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
    </MotionCard>
  );
};

export default ProductCard;
