import { FC } from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImagePlaceholderProps {
  className?: string;
  iconSize?: number;
  label?: string;
}

/** Reemplazo del placeholder de rayas para productos sin foto: un ícono
 * simple sobre un fondo neutro, en vez de un patrón que llamaba la atención. */
const ImagePlaceholder: FC<ImagePlaceholderProps> = ({ className, iconSize = 20, label }) => (
  <div
    className={cn(
      "flex h-full w-full flex-col items-center justify-center gap-1 bg-muted",
      className
    )}
  >
    <ImageOff size={iconSize} className="text-muted-foreground/40" strokeWidth={1.5} />
    {label && <span className="text-xs font-medium text-muted-foreground/70">{label}</span>}
  </div>
);

export default ImagePlaceholder;
