import { FC, useState } from "react";
import { Loader2 } from "lucide-react";
import { Outlet, useParams } from "react-router-dom";
import CartDrawer from "../cart/CartDrawer";
import { CartUIProvider } from "../../context/CartUIContext";
import useApplyStoreTheme from "../../hooks/useApplyStoreTheme";
import useCompanyBySlug from "../../hooks/useCompanyBySlug";
import useStoreAuth from "../../hooks/useStoreAuth";
import StoreNotFound from "../../pages/misc/StoreNotFound";
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
        <CartDrawer companySlug={companySlug!} companyId={companyId} />
      </div>
    </CartUIProvider>
  );
};

export default CompanyLayout;
