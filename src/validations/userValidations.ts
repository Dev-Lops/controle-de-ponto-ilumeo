import { z } from "zod";

export const userCodeSchema = z.object({
  codeUser: z
    .string()
    .nonempty("Campo obrigatório")
    .min(8, { message: "O código do usuário é composto por 8 caracteres" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "O código deve conter apenas letras e números",
    }),
});

export const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  code_name: z
    .string()
    .min(1, "O código é obrigatório.")
    .regex(/^[A-Z0-9]+$/, "O código deve conter apenas letras e números."),
});
