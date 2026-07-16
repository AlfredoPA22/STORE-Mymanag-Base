import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * React Router no restaura el scroll al navegar (a diferencia de una navegación
 * de navegador normal). Sin esto, entrar al detalle de un producto desde el final
 * de una página larga deja el scroll donde estaba, dando la impresión de que no
 * cambió de página.
 */
const ScrollToTop: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
