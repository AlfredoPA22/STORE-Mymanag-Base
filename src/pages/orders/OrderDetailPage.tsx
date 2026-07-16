import { useQuery } from "@apollo/client";
import { FC } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { Skeleton } from "../../components/ui/skeleton";
import { STORE_ORDER_DETAIL } from "../../graphql/queries/StoreAuth";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/currency";
import useStoreAuth from "../../hooks/useStoreAuth";

interface StoreOrderDetailItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  sale_price: number;
  subtotal: number;
}

interface StoreOrderDetail {
  code: string;
  date: string;
  status: string;
  total: number;
  is_paid: boolean;
  address: string | null;
  items: StoreOrderDetailItem[];
}

const OrderDetailPage: FC = () => {
  const { companySlug, orderId } = useParams();
  const { companyId, company } = useOutletContext<StoreOutletContext>();
  const { isAuthenticated } = useStoreAuth(companyId);

  const { data, loading, error } = useQuery<{ storeOrderDetail: StoreOrderDetail }>(
    STORE_ORDER_DETAIL,
    { variables: { orderId }, skip: !isAuthenticated, fetchPolicy: "network-only" }
  );

  if (!isAuthenticated) {
    return (
      <Navigate
        to={`/${companySlug}/login`}
        state={{ from: `/${companySlug}/pedidos/${orderId}` }}
        replace
      />
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !data?.storeOrderDetail) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="mb-4 text-muted-foreground">No se encontró el pedido.</p>
        <Link to={`/${companySlug}/pedidos`} className="font-semibold text-primary-dark">
          Volver a mis pedidos
        </Link>
      </div>
    );
  }

  const order = data.storeOrderDetail;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link
        to={`/${companySlug}/pedidos`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} /> Volver a mis pedidos
      </Link>

      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-foreground">Pedido {order.code}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
        </div>
        <Badge variant={order.status === "Aprobado" ? "success" : "secondary"}>{order.status}</Badge>
      </div>

      {order.address && (
        <p className="mb-6 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Dirección de entrega:</span> {order.address}
        </p>
      )}

      <Card>
        <CardContent className="space-y-3 p-4">
          {order.items.map((item) => (
            <div key={item.productId} className="flex items-center gap-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-full w-full object-contain"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{item.productName}</p>
                <p className="text-xs text-muted-foreground">
                  {item.quantity} x {formatPrice(item.sale_price, company?.currency)}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                {formatPrice(item.subtotal, company?.currency)}
              </p>
            </div>
          ))}

          <Separator />

          <div className="flex justify-between font-bold text-foreground">
            <span>Total</span>
            <span>{formatPrice(order.total, company?.currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailPage;
