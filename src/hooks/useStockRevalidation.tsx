import { useLazyQuery } from "@apollo/client";
import { useCallback } from "react";
import { toast } from "sonner";
import { STORE_LIST_PRODUCTS } from "../graphql/queries/Store";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCart } from "../redux/slices/cartSlice";
import { IStoreProduct } from "../utils/interfaces/StoreProduct";

const useStockRevalidation = (companyId: string) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cartSlice.items);
  const [fetchProducts, { loading: revalidating }] = useLazyQuery<{
    storeListProducts: IStoreProduct[];
  }>(STORE_LIST_PRODUCTS, { fetchPolicy: "network-only" });

  const revalidate = useCallback(async () => {
    if (!companyId || items.length === 0) return;

    const { data } = await fetchProducts({ variables: { companyId } });
    const products = data?.storeListProducts;
    if (!products) return;

    const productMap = new Map(products.map((p) => [p._id, p]));
    const removed: string[] = [];
    const adjusted: string[] = [];

    const nextItems = items
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product || product.status !== "Disponible") {
          removed.push(item.name);
          return null;
        }
        if (item.quantity > product.stock || item.stock !== product.stock) {
          if (item.quantity > product.stock) adjusted.push(item.name);
          return {
            ...item,
            stock: product.stock,
            quantity: Math.max(1, Math.min(item.quantity, product.stock)),
          };
        }
        return item;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null && item.quantity > 0);

    const changed =
      removed.length > 0 ||
      adjusted.length > 0 ||
      nextItems.length !== items.length;

    if (changed) {
      dispatch(setCart(nextItems));
    }

    if (removed.length > 0) {
      toast.error(`Ya no disponible: ${removed.join(", ")}`);
    }
    if (adjusted.length > 0) {
      toast.info(`Actualizamos la cantidad de: ${adjusted.join(", ")} según el stock disponible`);
    }
  }, [companyId, items, fetchProducts, dispatch]);

  return { revalidate, revalidating };
};

export default useStockRevalidation;
