import { FC } from "react";
import { FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import { ICompanyInfo } from "../../utils/interfaces/StoreProduct";

const Footer: FC<{ company: ICompanyInfo | null }> = ({ company }) => {
  return (
    <footer className="mt-16 border-t border-white/10 bg-dark text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <h3 className="mb-2 font-display text-lg font-bold tracking-tight text-white">
            {company?.name ?? "Tienda online"}
          </h3>
          {company?.tagline && (
            <p className="mb-2 text-sm font-medium text-primary-dark">{company.tagline}</p>
          )}
          {company?.description && (
            <p className="max-w-md text-sm leading-relaxed text-slate-400">{company.description}</p>
          )}
        </div>

        <div className="space-y-2 text-sm sm:text-right">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Contacto</p>
          {company?.address && (
            <p className="flex items-center gap-2 sm:justify-end">
              <FiMapPin className="shrink-0" /> {company.address}
            </p>
          )}
          {company?.phone && (
            <p className="flex items-center gap-2 sm:justify-end">
              <FiPhone className="shrink-0" /> {company.phone}
            </p>
          )}
          {company?.email && (
            <p className="flex items-center gap-2 sm:justify-end">
              <FiMail className="shrink-0" /> {company.email}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} {company?.name ?? "Tienda online"}. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
