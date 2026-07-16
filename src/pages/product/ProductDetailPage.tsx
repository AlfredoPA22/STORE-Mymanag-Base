import { useQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { ChevronRight, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import ProductCard from "../../components/product/ProductCard";
import StockBadge from "../../components/product/StockBadge";
import { STORE_LIST_PRODUCTS } from "../../graphql/queries/Store";
import { useCartUI } from "../../context/CartUIContext";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { addToCart } from "../../redux/slices/cartSlice";
import { IStoreProduct } from "../../utils/interfaces/StoreProduct";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";

const ProductDetailPage: FC = () => {
  const { id, companySlug } = useParams();
  const { companyId } = useOutletContext<StoreOutletContext>();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openCart } = useCartUI();
  const isAuthenticated = useAppSelector((state) => !!state.authSlice.token);

  const { data, loading } = useQuery<{ storeListProducts: IStoreProduct[] }>(STORE_LIST_PRODUCTS, {
    variables: { companyId },
  });

  const product = data?.storeListProducts.find((p) => p._id === id);

  const gallery = product
    ? Array.from(new Set([product.image, ...(product.images ?? [])].filter(Boolean)))
    : [];

  useEffect(() => {
    setActiveImage(gallery[0] ?? null);
    setQuantity(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const relatedProducts = (data?.storeListProducts ?? [])
    .filter(
      (p) =>
        p._id !== product?._id &&
        product?.category?._id &&
        p.category?._id === product.category._id
    )
    .slice(0, 4);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:px-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16 text-center">
        <p className="mb-4 text-muted-foreground">No se encontró el producto.</p>
        <Link to={`/${companySlug}`} className="font-semibold text-primary-dark">
          Volver al catálogo
        </Link>
      </div>
    );
  }

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
        quantity,
      })
    );
    toast.success(`${product.name} agregado al carrito`);
    openCart();
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:px-12">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <Link to={`/${companySlug}`} className="hover:text-foreground">
          Catálogo
        </Link>
        {product.category?.name && (
          <>
            <ChevronRight size={14} className="shrink-0" />
            <span>{product.category.name}</span>
          </>
        )}
        <ChevronRight size={14} className="shrink-0" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="grid gap-8 sm:grid-cols-2 lg:gap-16">
        <div>
          <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="h-full w-full object-contain" />
            ) : (
              <div className="placeholder-stripes flex h-full w-full items-center justify-center font-mono text-sm text-muted-foreground">
                Sin imagen
              </div>
            )}
          </div>

          {gallery.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border bg-muted ${
                    activeImage === img ? "border-primary ring-2 ring-primary" : "border-border"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          {product.category?.name && (
            <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-light">
              {product.category.name}
            </p>
          )}
          <h1 className="mb-3 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {product.name}
          </h1>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <span className="font-display text-3xl font-bold text-foreground">
              Bs {product.sale_price.toFixed(2)}
            </span>
            {product.regular_price != null && product.regular_price > product.sale_price && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  Bs {product.regular_price.toFixed(2)}
                </span>
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                  -{Math.round((1 - product.sale_price / product.regular_price) * 100)}%
                </span>
              </>
            )}
            <StockBadge stock={product.stock} />
          </div>

          {product.description && (
            <p className="mb-6 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {product.brand?.name && (
            <p className="mb-6 text-sm text-muted-foreground">
              Marca: <span className="font-medium text-foreground">{product.brand.name}</span>
            </p>
          )}

          <Separator className="mb-6" />

          {!outOfStock && (
            <div className="mb-6 flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus size={14} />
              </Button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 rounded-full"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              >
                <Plus size={14} />
              </Button>
            </div>
          )}

          <Button
            className="w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark disabled:bg-muted disabled:text-muted-foreground sm:w-auto sm:px-6"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            <ShoppingCart size={16} /> {outOfStock ? "Agotado" : "Agregar al carrito"}
          </Button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-lg font-bold text-foreground">
            También te puede interesar
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {relatedProducts.map((related) => (
              <ProductCard key={related._id} product={related} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;
