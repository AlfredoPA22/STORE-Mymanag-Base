import { FC } from "react";
import { MessageCircle, ShoppingCart, UserCheck } from "lucide-react";
import { ICompanyInfo } from "../../utils/interfaces/StoreProduct";

const steps = [
  {
    icon: ShoppingCart,
    title: "Agrega productos",
    description: "Explora el catálogo y arma tu carrito.",
  },
  {
    icon: UserCheck,
    title: "Completa tus datos",
    description: "Nombre, teléfono y dirección de entrega.",
  },
  {
    icon: MessageCircle,
    title: "Te contactamos",
    description: "Coordinamos el pago y la entrega contigo.",
  },
];

const CatalogHero: FC<{ company: ICompanyInfo | null }> = ({ company }) => {
  const hasBanner = !!company?.store_banner_image;

  return (
    <section
      className="hero-stripes relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: hasBanner
          ? `linear-gradient(rgba(8,55,68,0.75), rgba(8,55,68,0.75)), url(${company!.store_banner_image})`
          : "linear-gradient(120deg, var(--color-dark), var(--color-dark-light))",
      }}
    >
      <div className="relative mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-center sm:text-left">
          {company?.image && (
            <img
              src={company.image}
              alt={company.name}
              className="h-20 w-20 shrink-0 rounded-full border-4 border-white/90 object-cover shadow-md"
            />
          )}
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {company?.name ?? "Tienda online"}
            </h1>
            {company?.tagline && (
              <p className="mt-1 text-sm font-semibold text-primary">{company.tagline}</p>
            )}
            {company?.description && (
              <p className="mt-2 max-w-2xl text-sm text-white/70">{company.description}</p>
            )}
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex items-start gap-3.5 rounded-2xl bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-dark">
                <Icon size={17} />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
