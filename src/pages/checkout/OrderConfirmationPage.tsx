import { FC } from "react";
import { Check } from "lucide-react";
import { Link, useLocation, useParams, Navigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

interface OrderResultState {
  code: string;
  total: number;
  clientFullName: string;
}

const OrderConfirmationPage: FC = () => {
  const { companySlug } = useParams();
  const location = useLocation();
  const result = location.state as OrderResultState | undefined;

  if (!result) {
    return <Navigate to={`/${companySlug}`} replace />;
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
        <Check className="text-primary-foreground" size={28} strokeWidth={2.5} />
      </div>
      <h1 className="mb-2 font-display text-2xl font-bold text-foreground">¡Pedido recibido!</h1>
      <p className="mb-6 text-muted-foreground">
        Gracias, {result.clientFullName}. Nos pondremos en contacto contigo para coordinar el pago y la entrega.
      </p>

      <Card className="mb-8 text-left">
        <CardContent className="space-y-2 p-6">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Código de pedido</span>
            <span className="font-bold text-foreground">{result.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total</span>
            <span className="font-bold text-foreground">Bs {result.total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button asChild className="rounded-full bg-muted px-8 py-6 font-bold text-foreground hover:bg-muted/70">
        <Link to={`/${companySlug}`}>Seguir comprando</Link>
      </Button>
    </div>
  );
};

export default OrderConfirmationPage;
