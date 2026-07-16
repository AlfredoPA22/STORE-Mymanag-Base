import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Package, Search, Settings, ShoppingCart, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useCartUI } from "../../context/CartUIContext";
import { clearAuth } from "../../redux/slices/authSlice";
import { ICompanyInfo } from "../../utils/interfaces/StoreProduct";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";

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

  const handleLogout = () => {
    dispatch(clearAuth());
    setAccountOpen(false);
    navigate(`/${companySlug}`);
  };

  const searchInput = (className: string) => (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <Input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar productos..."
        className="rounded-full border-white/10 bg-white/10 pl-10 text-white placeholder-slate-300 transition-colors focus-visible:bg-white focus-visible:text-slate-800 focus-visible:placeholder-slate-400 focus-visible:ring-primary"
      />
    </div>
  );

  return (
    <header className="sticky top-0 z-40 bg-dark text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
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

        {searchInput("hidden flex-1 sm:block")}

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
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

      <div className="px-4 pb-3 sm:hidden">{searchInput("")}</div>
    </header>
  );
};

export default Navbar;
