import { useQuery } from "@apollo/client";
import { FC, useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { STORE_LIST_PRODUCTS } from "../../graphql/queries/Store";
import { IStoreProduct } from "../../utils/interfaces/StoreProduct";
import ProductCard from "../../components/product/ProductCard";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Skeleton } from "../../components/ui/skeleton";
import FilterCombobox from "../../components/catalog/FilterCombobox";
import ChipCarousel from "../../components/catalog/ChipCarousel";
import CatalogHero from "../../components/catalog/CatalogHero";
import Pagination from "../../components/common/Pagination";

type SortOption = "relevance" | "price_asc" | "price_desc";

const PAGE_SIZE = 24;

const CatalogPage: FC = () => {
  const { companyId, company, search } = useOutletContext<StoreOutletContext>();
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useQuery<{ storeListProducts: IStoreProduct[] }>(
    STORE_LIST_PRODUCTS,
    { variables: { companyId } }
  );

  const products = data?.storeListProducts ?? [];

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.category && map.set(p.category._id, p.category.name));
    return Array.from(map, ([_id, name]) => ({ _id, name }));
  }, [products]);

  const brands = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach((p) => p.brand && map.set(p.brand._id, p.brand.name));
    return Array.from(map, ([_id, name]) => ({ _id, name }));
  }, [products]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;

    let result = products.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        p.code.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term);
      const matchesCategory = !categoryFilter || p.category?._id === categoryFilter;
      const matchesBrand = !brandFilter || p.brand?._id === brandFilter;
      const matchesMin = min === null || Number.isNaN(min) || p.sale_price >= min;
      const matchesMax = max === null || Number.isNaN(max) || p.sale_price <= max;
      return matchesSearch && matchesCategory && matchesBrand && matchesMin && matchesMax;
    });

    if (sort === "price_asc") result = [...result].sort((a, b) => a.sale_price - b.sale_price);
    if (sort === "price_desc") result = [...result].sort((a, b) => b.sale_price - a.sale_price);

    return result;
  }, [products, search, categoryFilter, brandFilter, sort, minPrice, maxPrice]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, brandFilter, sort, minPrice, maxPrice]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (error) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-16 text-center text-destructive">
        No se pudo cargar el catálogo. Intenta de nuevo más tarde.
      </div>
    );
  }

  return (
    <div>
      <CatalogHero company={company} />

      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-8 lg:px-12">
        <ChipCarousel title="Categorías" options={categories} value={categoryFilter} onChange={setCategoryFilter} />

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <FilterCombobox
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categories.map((c) => ({ value: c._id, label: c.name }))}
            placeholder="Todas las categorías"
            searchPlaceholder="Buscar categoría..."
            emptyMessage="No se encontraron categorías."
          />

          <FilterCombobox
            value={brandFilter}
            onChange={setBrandFilter}
            options={brands.map((b) => ({ value: b._id, label: b.name }))}
            placeholder="Todas las marcas"
            searchPlaceholder="Buscar marca..."
            emptyMessage="No se encontraron marcas."
          />

          <div className="flex items-center gap-2">
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Precio mín."
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-28 rounded-full"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              placeholder="Precio máx."
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-28 rounded-full"
            />
          </div>

          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger className="ml-auto w-auto min-w-[12rem] rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevancia</SelectItem>
              <SelectItem value="price_asc">Precio: menor a mayor</SelectItem>
              <SelectItem value="price_desc">Precio: mayor a menor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="mb-4 flex items-baseline justify-between border-b border-border pb-3">
          <h2 className="font-display text-xl font-bold text-foreground">
            {categoryFilter ? categories.find((c) => c._id === categoryFilter)?.name : "Todos los productos"}
          </h2>
          {!loading && (
            <span className="text-sm text-muted-foreground">
              {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-full rounded-full" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">No se encontraron productos.</div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {paginated.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
