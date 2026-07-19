import { FC } from "react";
import { FiClock } from "react-icons/fi";

interface StoreUnavailableProps {
  companyName?: string;
}

const StoreUnavailable: FC<StoreUnavailableProps> = ({ companyName }) => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50">
    <FiClock size={48} className="text-slate-300 mb-4" />
    <h1 className="text-xl font-bold text-slate-800 mb-2">
      {companyName ? `${companyName} no está disponible` : "Esta tienda no está disponible"}
    </h1>
    <p className="text-slate-500 max-w-md">
      Esta tienda no está disponible por el momento. Si sos el dueño del negocio, contacta a soporte
      para reactivarla.
    </p>
  </div>
);

export default StoreUnavailable;
