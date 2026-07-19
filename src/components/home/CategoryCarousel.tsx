import { FC } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ImagePlaceholder from "../product/ImagePlaceholder";

export interface CategoryCard {
  _id: string;
  name: string;
  image: string | null;
}

const CategoryCarousel: FC<{ categories: CategoryCard[] }> = ({ categories }) => {
  const { companySlug } = useParams();
  const navigate = useNavigate();

  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 lg:px-12">
      <h2 className="mb-6 font-display text-xl font-bold text-foreground sm:text-2xl">
        Explora por categoría
      </h2>

      <Carousel opts={{ align: "start", dragFree: true }} className="px-1">
        <CarouselContent>
          {categories.map((category, i) => (
            <CarouselItem
              key={category._id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
            >
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
                whileHover={{ y: -3 }}
                onClick={() =>
                  navigate(`/${companySlug}/productos?categoria=${category._id}`)
                }
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-border shadow-sm transition-shadow hover:shadow-lg"
              >
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <ImagePlaceholder iconSize={28} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 p-3 text-left font-display text-sm font-bold text-white sm:text-base">
                  {category.name}
                </span>
              </motion.button>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </section>
  );
};

export default CategoryCarousel;
