import { FC } from "react";
import { Badge } from "../ui/badge";

const StockBadge: FC<{ stock: number }> = ({ stock }) => {
  if (stock <= 0) {
    return (
      <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-50">
        Agotado
      </Badge>
    );
  }

  if (stock <= 5) {
    return <Badge variant="warning">Últimas unidades</Badge>;
  }

  return <Badge variant="success">En stock</Badge>;
};

export default StockBadge;
