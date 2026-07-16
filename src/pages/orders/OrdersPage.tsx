import { useQuery } from "@apollo/client";
import { FC, useState } from "react";
import { ChevronRight, Package } from "lucide-react";
import { Link, Navigate, useOutletContext, useParams } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import Pagination from "../../components/common/Pagination";
import { STORE_MY_ORDERS } from "../../graphql/queries/StoreAuth";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import { formatDate } from "../../utils/formatDate";
import { formatPrice } from "../../utils/currency";
import useStoreAuth from "../../hooks/useStoreAuth";

interface StoreOrder {
  _id: string;
  code: string;
  date: string;
  status: string;
  total: number;
  is_paid: boolean;
}

const PAGE_SIZE = 8;

const OrdersPage: FC = () => {
  const { companySlug } = useParams();
  const { companyId, company } = useOutletContext<StoreOutletContext>();
  const { isAuthenticated } = useStoreAuth(companyId);
  const [page, setPage] = useState(1);

  const { data, loading } = useQuery<{ storeMyOrders: StoreOrder[] }>(STORE_MY_ORDERS, {
    skip: !isAuthenticated,
    fetchPolicy: "network-only",
  });

  if (!isAuthenticated) {
    return <Navigate to={`/${companySlug}/login`} state={{ from: `/${companySlug}/pedidos` }} replace />;
  }

  const orders = data?.storeMyOrders ?? [];
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE));
  const paginated = orders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-xl font-bold text-foreground">Mis pedidos</h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <Package size={40} strokeWidth={1.5} />
          <p>Todavía no tienes pedidos.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((order) => (
              <Link key={order._id} to={`/${companySlug}/pedidos/${order._id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-semibold text-foreground">{order.code}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(order.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold text-foreground">
                          {formatPrice(order.total, company?.currency)}
                        </p>
                        <Badge variant={order.status === "Aprobado" ? "success" : "secondary"}>
                          {order.status}
                        </Badge>
                      </div>
                      <ChevronRight size={18} className="shrink-0 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default OrdersPage;
