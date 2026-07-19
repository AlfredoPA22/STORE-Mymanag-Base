import { FC } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ShoppingCart, UserCheck } from "lucide-react";

const steps = [
  {
    icon: ShoppingCart,
    title: "Agrega productos",
    description: "Explora el catálogo y arma tu carrito.",
  },
  {
    icon: UserCheck,
    title: "Completa tus datos",
    description: "Nombre, teléfono y dirección de entrega.",
  },
  {
    icon: MessageCircle,
    title: "Te contactamos",
    description: "Coordinamos el pago y la entrega contigo.",
  },
];

const HowItWorks: FC = () => (
  <section className="mx-auto max-w-[1400px] px-4 py-10 sm:px-8 lg:px-12">
    <h2 className="mb-6 text-center font-display text-xl font-bold text-foreground sm:text-2xl">
      ¿Cómo comprar?
    </h2>
    <div className="grid gap-4 sm:grid-cols-3">
      {steps.map(({ icon: Icon, title, description }, i) => (
        <motion.div
          key={title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          whileHover={{ y: -3 }}
          className="flex items-start gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
        >
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-primary-foreground"
            style={{
              background: "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))",
            }}
          >
            <Icon size={17} />
          </div>
          <div>
            <p className="text-sm font-bold text-foreground">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default HowItWorks;
