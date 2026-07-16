import { FC } from "react";
import { useMutation } from "@apollo/client";
import { useFormik } from "formik";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { STORE_UPDATE_PROFILE } from "../../graphql/mutations/StoreAuth";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateClientInfo } from "../../redux/slices/authSlice";

const validationSchema = yup.object({
  fullName: yup.string().required("Ingresa tu nombre completo"),
  email: yup.string().email("Correo inválido"),
  address: yup.string(),
});

const AccountPage: FC = () => {
  const { companySlug } = useParams();
  const client = useAppSelector((state) => state.authSlice.client);
  const dispatch = useAppDispatch();
  const [storeUpdateProfileMutation, { loading }] = useMutation(STORE_UPDATE_PROFILE);

  const formik = useFormik({
    initialValues: {
      fullName: client?.fullName ?? "",
      email: client?.email ?? "",
      address: client?.address ?? "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await storeUpdateProfileMutation({
          variables: {
            input: {
              fullName: values.fullName,
              email: values.email || "",
              address: values.address || "",
            },
          },
        });
        dispatch(updateClientInfo(data.storeUpdateProfile));
        toast.success("Perfil actualizado");
      } catch (error: any) {
        toast.error(error.message ?? "No se pudo actualizar el perfil");
      }
    },
  });

  if (!client) {
    return (
      <Navigate
        to={`/${companySlug}/login`}
        state={{ from: `/${companySlug}/cuenta` }}
        replace
      />
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Mi cuenta</CardTitle>
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
              <Input id="phoneNumber" value={client.phoneNumber} readOnly disabled />
              <p className="text-xs text-muted-foreground">
                El teléfono no se puede cambiar.
              </p>
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

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-primary py-6 font-bold text-primary-foreground hover:bg-primary-dark"
            >
              {loading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountPage;
