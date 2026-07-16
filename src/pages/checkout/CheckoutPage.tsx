import { useMutation } from "@apollo/client";
import { Loader2, Pencil } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import { STORE_CREATE_ORDER_FOR_CLIENT } from "../../graphql/mutations/StoreAuth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { clearCart } from "../../redux/slices/cartSlice";
import { updateClientInfo } from "../../redux/slices/authSlice";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import useStoreAuth from "../../hooks/useStoreAuth";
import useStockRevalidation from "../../hooks/useStockRevalidation";
import { formatPrice } from "../../utils/currency";

const CheckoutPage: FC = () => {
  const { companySlug } = useParams();
  const { companyId, company } = useOutletContext<StoreOutletContext>();
  const items = useAppSelector((state) => state.cartSlice.items);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, client } = useStoreAuth(companyId);
  const { revalidate, revalidating } = useStockRevalidation(companyId);

  useEffect(() => {
    revalidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Se toma una sola vez al entrar a checkout: no se resincroniza con cada
  // render, para que no "pelee" con lo que el cliente esté escribiendo.
  const [address, setAddress] = useState(() => client?.address ?? "");
  const [isEditingAddress, setIsEditingAddress] = useState(() => !client?.address);

  const [storeCreateOrderForClient, { loading }] = useMutation(STORE_CREATE_ORDER_FOR_CLIENT);

  const subtotal = items.reduce((acc, item) => acc + item.sale_price * item.quantity, 0);

  const handleSubmit = async () => {
    try {
      const { data } = await storeCreateOrderForClient({
        variables: {
          address: address || undefined,
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        },
      });

      if (address) {
        dispatch(updateClientInfo({ address }));
      }
      dispatch(clearCart());
      navigate(`/${companySlug}/pedido-confirmado`, { state: data.storeCreateOrderForClient });
    } catch (error: any) {
      toast.error(error.message ?? "No se pudo procesar el pedido. Intenta de nuevo.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="mb-4 text-muted-foreground">Tu carrito está vacío.</p>
        <Link to={`/${companySlug}`} className="font-semibold text-primary-dark">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="mb-2 font-display text-xl font-bold text-foreground">Inicia sesión para continuar</h1>
        <p className="mb-6 text-muted-foreground">
          Necesitas una cuenta para finalizar tu pedido y poder verlo después en "Mis pedidos".
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="rounded-full bg-primary font-bold text-primary-foreground hover:bg-primary-dark"
          >
            <Link to={`/${companySlug}/login`} state={{ from: `/${companySlug}/checkout` }}>
              Iniciar sesión
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full">
            <Link to={`/${companySlug}/registro`} state={{ from: `/${companySlug}/checkout` }}>
              Crear cuenta
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-8 sm:py-10">
      <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Finalizar pedido
      </h1>
      <p className="text-sm text-muted-foreground">
        Revisa tu carrito y completa tus datos. Te contactaremos para coordinar pago y entrega.
      </p>
      <p className="mb-9 mt-1.5 flex h-4 items-center gap-2 text-xs text-muted-foreground">
        {revalidating && (
          <>
            <Loader2 size={13} className="animate-spin" /> Verificando disponibilidad de stock...
          </>
        )}
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-sm font-bold text-foreground">Tus datos</p>
          <Card>
            <CardContent className="space-y-4 p-6">
              <p className="text-sm text-muted-foreground">
                {client?.fullName} · {client?.phoneNumber}
              </p>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">Dirección de entrega</p>
                  {!isEditingAddress && (
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(true)}
                      className="flex items-center gap-1 text-xs font-semibold text-primary-dark hover:underline"
                    >
                      <Pencil size={12} /> Editar
                    </button>
                  )}
                </div>

                {isEditingAddress ? (
                  <div className="space-y-2">
                    <Textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      autoFocus
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setIsEditingAddress(false)}
                    >
                      Listo
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-foreground">
                    {address || (
                      <span className="text-muted-foreground">Sin dirección registrada.</span>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Button
            type="button"
            disabled={loading || revalidating}
            onClick={handleSubmit}
            className="mt-6 w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark"
          >
            {loading ? "Enviando pedido..." : "Confirmar pedido"}
          </Button>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Nos pondremos en contacto para coordinar el pago y la entrega.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-bold text-foreground">Tu pedido</p>
          <Card className="h-fit">
            <CardContent className="space-y-4 p-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-3">
                  <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-lg bg-muted">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
                    ) : (
                      <div className="placeholder-stripes h-full w-full" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Cant. {item.quantity} × {formatPrice(item.sale_price, company?.currency)}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-foreground">
                    {formatPrice(item.sale_price * item.quantity, company?.currency)}
                  </span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(subtotal, company?.currency)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
