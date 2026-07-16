import { useMutation } from "@apollo/client";
import { useEffect } from "react";
import { STORE_LOGIN, STORE_REGISTER, STORE_UPDATE_CART } from "../graphql/mutations/StoreAuth";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { clearAuth, setAuth } from "../redux/slices/authSlice";
import { CartItem, clearCart, setCart } from "../redux/slices/cartSlice";

interface RegisterInput {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address?: string;
  password: string;
}

interface ServerCartItem {
  productId: string;
  name: string;
  image: string;
  sale_price: number;
  stock: number;
  quantity: number;
}

const toCartItems = (cart: ServerCartItem[]): CartItem[] =>
  cart.map((item) => ({
    productId: item.productId,
    name: item.name,
    image: item.image,
    sale_price: item.sale_price,
    stock: item.stock,
    quantity: item.quantity,
  }));

const useStoreAuth = (companyId: string) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.authSlice.token);
  const client = useAppSelector((state) => state.authSlice.client);
  const items = useAppSelector((state) => state.cartSlice.items);

  const [storeLoginMutation, { loading: loadingLogin }] = useMutation(STORE_LOGIN);
  const [storeRegisterMutation, { loading: loadingRegister }] = useMutation(STORE_REGISTER);
  const [storeUpdateCartMutation] = useMutation(STORE_UPDATE_CART);

  const login = async (phoneNumber: string, password: string) => {
    const { data } = await storeLoginMutation({ variables: { companyId, phoneNumber, password } });
    const result = data.storeLogin;
    dispatch(setAuth({ token: result.token, client: result.client, companyId }));
    dispatch(setCart(toCartItems(result.cart)));
  };

  const register = async (input: RegisterInput) => {
    const { data } = await storeRegisterMutation({ variables: { companyId, input } });
    const result = data.storeRegister;
    dispatch(setAuth({ token: result.token, client: result.client, companyId }));
    dispatch(setCart(toCartItems(result.cart)));
  };

  const logout = () => {
    dispatch(clearAuth());
    dispatch(clearCart());
  };

  // Sincroniza el carrito al backend mientras haya sesión (debounced)
  useEffect(() => {
    if (!token) return;

    const handle = setTimeout(() => {
      storeUpdateCartMutation({
        variables: {
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        },
      }).catch(() => {});
    }, 600);

    return () => clearTimeout(handle);
  }, [items, token]);

  return {
    token,
    client,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    loadingLogin,
    loadingRegister,
  };
};

export default useStoreAuth;
