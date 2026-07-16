import { useEffect, useState } from "react";
import { ICompanyInfo } from "../utils/interfaces/StoreProduct";

interface CompanyResolution {
  company: ICompanyInfo | null;
  companyId: string | null;
  loading: boolean;
  notFound: boolean;
}

const useCompanyBySlug = (slug?: string): CompanyResolution => {
  const [state, setState] = useState<CompanyResolution>({
    company: null,
    companyId: null,
    loading: true,
    notFound: false,
  });

  useEffect(() => {
    if (!slug) {
      setState({ company: null, companyId: null, loading: false, notFound: true });
      return;
    }

    let cancelled = false;
    setState((s) => ({ ...s, loading: true, notFound: false }));

    const apiUrl = import.meta.env.VITE_API_URL;

    fetch(`${apiUrl}/company/by-slug/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Empresa no encontrada");
        return res.json();
      })
      .then((basic) => fetch(`${apiUrl}/company/info/${basic.companyId}`).then((r) => r.json()))
      .then((info: ICompanyInfo) => {
        if (!cancelled) {
          setState({ company: info, companyId: info.companyId, loading: false, notFound: false });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ company: null, companyId: null, loading: false, notFound: true });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
};

export default useCompanyBySlug;
