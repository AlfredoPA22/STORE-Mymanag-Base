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
  fullName: yup.string().required("Ingresa tu nombre completo"),
  phoneNumber: yup.string().required("Ingresa tu teléfono"),
  email: yup.string().email("Correo inválido"),
  address: yup.string(),
  password: yup.string().min(6, "Mínimo 6 caracteres").required("Ingresa una contraseña"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirma tu contraseña"),
});

const RegisterPage: FC = () => {
  const { companySlug } = useParams();
  const { companyId } = useOutletContext<StoreOutletContext>();
  const { register, loadingRegister } = useStoreAuth(companyId);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string } | null)?.from ?? `/${companySlug}`;

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register({
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          email: values.email || undefined,
          address: values.address || undefined,
          password: values.password,
        });
        navigate(from, { replace: true });
      } catch (error: any) {
        toast.error(error.message ?? "No se pudo crear la cuenta");
      }
    },
  });

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Crea tu cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Nombre completo</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formik.values.fullName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-xs text-destructive">{formik.errors.fullName}</p>
              )}
            </div>

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
              <Label htmlFor="email">Correo (opcional)</Label>
              <Input
                id="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-destructive">{formik.errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="address">Dirección (opcional)</Label>
              <Input
                id="address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
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

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-xs text-destructive">{formik.errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loadingRegister}
              className="w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark"
            >
              {loadingRegister ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to={`/${companySlug}/login`} className="font-semibold text-primary-dark">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
