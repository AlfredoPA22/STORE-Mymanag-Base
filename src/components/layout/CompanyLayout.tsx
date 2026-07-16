import { FC, useLayoutEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Outlet, useParams } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";
import { CartUIProvider } from "../../context/CartUIContext";
import useApplyStoreTheme from "../../hooks/useApplyStoreTheme";
import useCompanyBySlug from "../../hooks/useCompanyBySlug";
import useStoreAuth from "../../hooks/useStoreAuth";
import StoreNotFound from "../../pages/misc/StoreNotFound";
import { useAppDispatch } from "../../redux/hooks";
import { switchCompany as switchAuthCompany } from "../../redux/slices/authSlice";
import { switchCompany as switchCartCompany } from "../../redux/slices/cartSlice";
import { ICompanyInfo } from "../../utils/interfaces/StoreProduct";
import Navbar from "./Navbar";
import Footer from "./Footer";

export interface StoreOutletContext {
  companyId: string;
  company: ICompanyInfo | null;
  search: string;
}

const CompanyLayout: FC = () => {
  const { companySlug } = useParams();
  const [search, setSearch] = useState("");
  const { company, companyId, loading, notFound } = useCompanyBySlug(companySlug);
  const dispatch = useAppDispatch();

  // Se ejecuta antes que cualquier otro efecto (incluido el de sincronización
  // de carrito de useStoreAuth) para que, al entrar a otra tienda, el carrito
  // y la sesión activa ya sean los de esa tienda (guardando los de la
  // anterior) antes de sincronizar o mostrar nada.
  useLayoutEffect(() => {
    if (!companyId) return;
    dispatch(switchCartCompany(companyId));
    dispatch(switchAuthCompany(companyId));
  }, [companyId, dispatch]);

  // Mantiene el carrito sincronizado con el backend mientras haya sesión,
  // sin importar en qué página esté navegando el cliente.
  useStoreAuth(companyId ?? "");
  useApplyStoreTheme(company?.store_theme);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="animate-spin text-primary-dark" size={32} />
        <p className="text-sm">Cargando tienda…</p>
      </div>
    );
  }

  if (notFound || !companyId) {
    return <StoreNotFound />;
  }

  return (
    <CartUIProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar company={company} companySlug={companySlug!} search={search} onSearchChange={setSearch} />
        <main className="flex-1">
          <Outlet context={{ companyId, company, search } satisfies StoreOutletContext} />
        </main>
        <Footer company={company} />
        <CartDrawer companySlug={companySlug!} companyId={companyId} currency={company?.currency} />
      </div>
    </CartUIProvider>
  );
};

export default CompanyLayout;
