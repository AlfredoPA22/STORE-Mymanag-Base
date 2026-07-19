import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import ScrollToTop from "../components/common/ScrollToTop";
import CompanyLayout from "../components/layout/CompanyLayout";
import HomePage from "../pages/home/HomePage";
import ProductsPage from "../pages/products/ProductsPage";
import ProductDetailPage from "../pages/product/ProductDetailPage";
import CheckoutPage from "../pages/checkout/CheckoutPage";
import OrderConfirmationPage from "../pages/checkout/OrderConfirmationPage";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import OrdersPage from "../pages/orders/OrdersPage";
import OrderDetailPage from "../pages/orders/OrderDetailPage";
import AccountPage from "../pages/account/AccountPage";
import LandingPrompt from "../pages/misc/LandingPrompt";

const AppRoutes: FC = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<LandingPrompt />} />
      <Route path="/:companySlug" element={<CompanyLayout />}>
        <Route index element={<HomePage />} />
        <Route path="productos" element={<ProductsPage />} />
        <Route path="producto/:id" element={<ProductDetailPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="pedido-confirmado" element={<OrderConfirmationPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegisterPage />} />
        <Route path="pedidos" element={<OrdersPage />} />
        <Route path="pedidos/:orderId" element={<OrderDetailPage />} />
        <Route path="cuenta" element={<AccountPage />} />
      </Route>
    </Routes>
  </>
);

export default AppRoutes;
