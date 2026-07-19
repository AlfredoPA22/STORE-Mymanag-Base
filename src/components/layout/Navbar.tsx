import { FC, useState } from "react";
import { useQuery } from "@apollo/client";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Package, Search, Settings, ShoppingCart, User, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useCartUI } from "../../context/CartUIContext";
import { clearAuth } from "../../redux/slices/authSlice";
import { clearCart } from "../../redux/slices/cartSlice";
import { STORE_LIST_PRODUCTS } from "../../graphql/queries/Store";
import { formatPrice } from "../../utils/currency";
import { ICompanyInfo, IStoreProduct } from "../../utils/interfaces/StoreProduct";
import ImagePlaceholder from "../product/ImagePlaceholder";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

const MAX_SEARCH_RESULTS = 6;

interface NavbarProps {
  company: ICompanyInfo | null;
  companySlug: string;
  search: string;
  onSearchChange: (value: string) => void;
}

const Navbar: FC<NavbarProps> = ({ company, companySlug, search, onSearchChange }) => {
  const cartCount = useAppSelector((state) =>
    state.cartSlice.items.reduce((acc, item) => acc + item.quantity, 0)
  );
  const client = useAppSelector((state) => state.authSlice.client);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { openCart } = useCartUI();
  const [accountOpen, setAccountOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const { data: searchData, loading: loadingSearch } = useQuery<{
    storeListProducts: IStoreProduct[];
  }>(STORE_LIST_PRODUCTS, {
    variables: { companyId: company?.companyId },
    skip: !company?.companyId,
  });

  const handleLogout = () => {
    dispatch(clearAuth());
    dispatch(clearCart());
    setAccountOpen(false);
    navigate(`/${companySlug}`);
  };

  const searchTerm = search.trim().toLowerCase();
  const searchResults = searchTerm
    ? (searchData?.storeListProducts ?? [])
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchTerm) ||
            p.code.toLowerCase().includes(searchTerm) ||
            p.description?.toLowerCase().includes(searchTerm)
        )
        .slice(0, MAX_SEARCH_RESULTS)
    : [];

  const handleSelectResult = (productId: string) => {
    // No se fuerza isSearchFocused a false aquí: el input nunca pierde el foco
    // real (por el preventDefault del onMouseDown de cada resultado), así que
    // forzarlo desincroniza el estado y el dropdown deja de reaccionar a la
    // siguiente búsqueda hasta un blur/focus manual. Al vaciar el término de
    // búsqueda el dropdown ya se oculta solo.
    onSearchChange("");
    setMobileSearchOpen(false);
    navigate(`/${companySlug}/producto/${productId}`);
  };

  const searchInput = (className: string) => (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        placeholder="Buscar productos..."
        className="rounded-full border-white/10 bg-white/10 pl-10 text-white placeholder-slate-300 transition-colors focus-visible:bg-white focus-visible:text-slate-800 focus-visible:placeholder-slate-400 focus-visible:ring-primary"
      />

      {isSearchFocused && searchTerm.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-white p-2 shadow-lg">
          {loadingSearch ? (
            <div className="space-y-1 p-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <Skeleton className="h-11 w-11 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : searchResults.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              No se encontraron productos.
            </p>
          ) : (
            searchResults.map((product) => (
              <button
                key={product._id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelectResult(product._id)}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none"
              >
                <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-muted">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ImagePlaceholder iconSize={16} />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                  {product.category?.name && (
                    <p className="truncate text-xs text-muted-foreground">
                      {product.category.name}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-sm font-bold text-foreground">
                  {formatPrice(product.sale_price, company?.currency)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-dark text-white shadow-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-8 lg:px-12">
        <Link to={`/${companySlug}`} className="flex shrink-0 items-center gap-2">
          {company?.image && (
            <img
              src={company.image}
              alt={company.name}
              className="h-9 w-9 rounded-full border-2 border-primary object-cover"
            />
          )}
          <span className="max-w-[160px] truncate font-display text-lg font-bold leading-tight tracking-tight sm:max-w-none sm:text-xl">
            {company?.name ?? "Tienda online"}
          </span>
        </Link>

        <nav className="hidden shrink-0 items-center gap-1 sm:flex">
          <NavLink
            to={`/${companySlug}`}
            end
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
              }`
            }
          >
            Inicio
          </NavLink>
          <NavLink
            to={`/${companySlug}/productos`}
            className={({ isActive }) =>
              `rounded-full px-3 py-1.5 text-sm font-semibold transition-colors ${
                isActive ? "bg-white/15 text-white" : "text-white/70 hover:text-white"
              }`
            }
          >
            Productos
          </NavLink>
        </nav>

        {searchInput("hidden flex-1 sm:block")}

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="rounded-full bg-white/10 text-white hover:bg-primary hover:text-dark sm:hidden"
            aria-label={mobileSearchOpen ? "Cerrar búsqueda" : "Buscar"}
          >
            {mobileSearchOpen ? <X size={18} /> : <Search size={18} />}
          </Button>

          {client ? (
            <Popover open={accountOpen} onOpenChange={setAccountOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full bg-white/10 text-white hover:bg-primary hover:text-dark"
                  aria-label="Cuenta"
                >
                  <User size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-56 p-2">
                <p className="truncate px-2 py-1.5 text-sm font-semibold text-foreground">
                  {client.fullName}
                </p>
                <Separator className="my-1" />
                <Link
                  to={`/${companySlug}/pedidos`}
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  <Package size={16} /> Mis pedidos
                </Link>
                <Link
                  to={`/${companySlug}/cuenta`}
                  onClick={() => setAccountOpen(false)}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-muted"
                >
                  <Settings size={16} /> Mi cuenta
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-destructive hover:bg-muted"
                >
                  Cerrar sesión
                </button>
              </PopoverContent>
            </Popover>
          ) : (
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/10 text-white hover:bg-primary hover:text-dark"
              aria-label="Iniciar sesión"
            >
              <Link to={`/${companySlug}/login`}>
                <User size={18} />
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            className="relative rounded-full bg-white/10 text-white hover:bg-primary hover:text-dark"
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-dark">
                {cartCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {mobileSearchOpen && (
        <div className="px-4 pb-3 sm:hidden">{searchInput("")}</div>
      )}
    </header>
  );
};

export default Navbar;
