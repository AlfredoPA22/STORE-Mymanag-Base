import { FC } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ICompanyInfo } from "../../utils/interfaces/StoreProduct";
import { Button } from "../ui/button";

const HomeHero: FC<{ company: ICompanyInfo | null }> = ({ company }) => {
  const { companySlug } = useParams();
  const navigate = useNavigate();
  const hasBanner = !!company?.store_banner_image;

  return (
    <section
      className="relative overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: hasBanner
          ? `linear-gradient(color-mix(in srgb, var(--color-dark) 78%, transparent), color-mix(in srgb, var(--color-dark) 78%, transparent)), url(${company!.store_banner_image})`
          : "linear-gradient(135deg, var(--color-dark), var(--color-dark-light))",
      }}
    >
      {/* Formas decorativas animadas, con los colores del tema — dan
          movimiento de fondo sin distraer del contenido. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-primary) 45%, transparent)" }}
        animate={{ x: [0, 24, 0], y: [0, 18, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-16 h-80 w-80 rounded-full blur-3xl"
        style={{ background: "color-mix(in srgb, var(--color-light) 35%, transparent)" }}
        animate={{ x: [0, -20, 0], y: [0, -16, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex max-w-[1400px] flex-col items-center px-4 py-16 text-center sm:px-8 sm:py-24 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Sparkles size={12} />
            Bienvenido a {company?.name ?? "nuestra tienda"}
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {company?.tagline || "Encuentra lo que buscas, al mejor precio"}
          </h1>
          {company?.description && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-white/70 sm:text-base">
              {company.description}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <Button
            size="lg"
            className="mt-8 rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary-dark"
            onClick={() => navigate(`/${companySlug}/productos`)}
          >
            Ver catálogo
            <ArrowRight size={18} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default HomeHero;
