import { FC, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";

interface ChipOption {
  _id: string;
  name: string;
}

interface ChipCarouselProps {
  title: string;
  options: ChipOption[];
  value: string;
  onChange: (value: string) => void;
}

const ChipCarousel: FC<ChipCarouselProps> = ({ title, options, value, onChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8 * (direction === "left" ? -1 : 1);
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (options.length === 0) return null;

  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      <div className="relative flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full sm:flex"
          onClick={() => scroll("left")}
          aria-label={`${title}: ver anteriores`}
        >
          <ChevronLeft size={16} />
        </Button>

        <div ref={scrollRef} className="flex flex-1 gap-2 overflow-x-auto scroll-smooth pb-1">
          <button
            onClick={() => onChange("")}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
              value === ""
                ? "border-primary bg-primary/15 text-primary-dark"
                : "border-border bg-background text-muted-foreground hover:bg-muted"
            )}
          >
            Todas
          </button>
          {options.map((option) => (
            <button
              key={option._id}
              onClick={() => onChange(option._id)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                value === option._id
                  ? "border-primary bg-primary/15 text-primary-dark"
                  : "border-border bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              {option.name}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="icon"
          className="hidden shrink-0 rounded-full sm:flex"
          onClick={() => scroll("right")}
          aria-label={`${title}: ver más`}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default ChipCarousel;
