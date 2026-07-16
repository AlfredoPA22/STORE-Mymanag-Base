import { FC } from "react";
import { useFormik } from "formik";
import { Link, useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { StoreOutletContext } from "../../components/layout/CompanyLayout";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import useStoreAuth from "../../hooks/useStoreAuth";

const validationSchema = yup.object({
  phoneNumber: yup.string().required("Ingresa tu teléfono"),
  password: yup.string().required("Ingresa tu contraseña"),
});

const LoginPage: FC = () => {
  const { companySlug } = useParams();
  const { companyId } = useOutletContext<StoreOutletContext>();
  const { login, loadingLogin } = useStoreAuth(companyId);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? `/${companySlug}`;

  const formik = useFormik({
    initialValues: { phoneNumber: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await login(values.phoneNumber, values.password);
        navigate(from, { replace: true });
      } catch (error: any) {
        toast.error(error.message ?? "No se pudo iniciar sesión");
      }
    },
  });

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Inicia sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">Teléfono</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                <p className="text-xs text-destructive">{formik.errors.phoneNumber}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-destructive">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loadingLogin}
              className="w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark"
            >
              {loadingLogin ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link to={`/${companySlug}/registro`} className="font-semibold text-primary-dark">
              Regístrate
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
