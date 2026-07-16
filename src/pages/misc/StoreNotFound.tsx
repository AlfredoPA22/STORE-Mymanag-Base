import { FC } from "react";
import { FiAlertCircle } from "react-icons/fi";

const StoreNotFound: FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50">
    <FiAlertCircle size={48} className="text-slate-300 mb-4" />
    <h1 className="text-xl font-bold text-slate-800 mb-2">Tienda no encontrada</h1>
    <p className="text-slate-500 max-w-md">
      El enlace que abriste no corresponde a ninguna tienda activa. Verifica la dirección o contacta al
      negocio para obtener el enlace correcto.
    </p>
  </div>
);

export default StoreNotFound;
