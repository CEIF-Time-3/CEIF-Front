import { z } from "zod";

export const cartItemSchema = z.object({
  id: z.string().min(1, "ID do item é obrigatório"),
  productId: z.string().min(1, "ID do produto é obrigatório"),
  name: z.string().min(1, "Nome do produto é obrigatório"),
  price: z.string().min(1, "Preço é obrigatório"),
  unitPrice: z.number().nonnegative(),
  imageUrl: z.string().nullable().optional(),
  quantity: z.number().int().positive("A quantidade deve ser maior que zero"),
  observation: z
    .string()
    .max(300, "A observação deve ter no máximo 300 caracteres")
    .nullable()
    .optional(),
});

export const checkoutSchema = z
  .object({
    customerName: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome muito longo"),
    customerPhone: z
      .string()
      .min(10, "Informe um telefone válido com DDD")
      .max(16, "Telefone inválido"),
    deliveryType: z.enum(["delivery", "takeaway"], {
      message: "Selecione o tipo de entrega",
    }),
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
    complement: z.string().optional(),
    paymentMethod: z.enum(["pix", "card", "cash"], {
      message: "Selecione a forma de pagamento",
    }),
    changeFor: z.string().optional(),
    observation: z
      .string()
      .max(300, "A observação deve ter no máximo 300 caracteres")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryType === "delivery") {
      if (!data.street || data.street.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Rua/Logradouro é obrigatório para entrega",
          path: ["street"],
        });
      }
      if (!data.number || data.number.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Número é obrigatório para entrega",
          path: ["number"],
        });
      }
      if (!data.neighborhood || data.neighborhood.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "Bairro é obrigatório para entrega",
          path: ["neighborhood"],
        });
      }
    }
  });

export type CartItem = z.infer<typeof cartItemSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
