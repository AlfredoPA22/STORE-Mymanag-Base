import { FC } from "react";
import { FiShoppingBag } from "react-icons/fi";

const LandingPrompt: FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-slate-50">
    <FiShoppingBag size={48} className="text-primary-dark mb-4" />
    <h1 className="text-xl font-bold text-slate-800 mb-2">Plataforma de tiendas Inventasys</h1>
    <p className="text-slate-500 max-w-md">
      Ingresa usando el enlace de la tienda que quieres visitar, por ejemplo:{" "}
      <code className="bg-slate-100 px-1.5 py-0.5 rounded">tutienda.com/mi-empresa</code>
    </p>
  </div>
);

export default LandingPrompt;
