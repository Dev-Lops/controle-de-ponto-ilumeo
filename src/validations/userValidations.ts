import { z } from "zod";

export const userCodeSchema = z.object({
  codeUser: z
    .string()
    .min(1, { message: "O código do usuário é obrigatório" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "O código deve conter apenas letras e números",
    }),
});
