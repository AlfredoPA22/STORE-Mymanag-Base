import { useQuery } from "@apollo/client";
import { FC, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { STORE_LIST_PRODUCTS } from "../../graphql/queries/Store";
import { IStoreProduct } from "../../utils/interfaces/StoreProduct";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import HomeHero from "../../components/home/HomeHero";
import HowItWorks from "../../components/home/HowItWorks";
import CategoryCarousel, { CategoryCard } from "../../components/home/CategoryCarousel";
import { Button } from "../../components/ui/button";

const HomePage: FC = () => {
  const { companyId, company } = useOutletContext<StoreOutletContext>();
  const { companySlug } = useParams();
  const navigate = useNavigate();

  const { data } = useQuery<{ storeListProducts: IStoreProduct[] }>(STORE_LIST_PRODUCTS, {
    variables: { companyId },
  });

  const products = data?.storeListProducts ?? [];

  const categories = useMemo<CategoryCard[]>(() => {
    const map = new Map<string, CategoryCard>();
    products.forEach((p) => {
      if (!p.category) return;
      const existing = map.get(p.category._id);
      if (!existing) {
        map.set(p.category._id, { _id: p.category._id, name: p.category.name, image: p.image ?? null });
      } else if (!existing.image && p.image) {
        existing.image = p.image;
      }
    });
    return Array.from(map.values());
  }, [products]);

  return (
    <div>
      <HomeHero company={company} />
      <HowItWorks />
      <CategoryCarousel categories={categories} />

      <section className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-4 px-4 py-12 text-center sm:px-8 lg:px-12">
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            ¿Ya sabes qué buscas?
          </h2>
          <p className="max-w-md text-sm text-muted-foreground">
            Mira el catálogo completo con todos nuestros productos disponibles.
          </p>
          <Button
            size="lg"
            className="rounded-full bg-primary px-8 font-semibold text-primary-foreground hover:bg-primary-dark"
            onClick={() => navigate(`/${companySlug}/productos`)}
          >
            Ver todo el catálogo
            <ArrowRight size={18} />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
