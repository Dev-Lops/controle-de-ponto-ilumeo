import { z } from "zod";

// Esquema para validar o código do usuário
export const userCodeSchema = z.object({
  codeUser: z
    .string()
    .nonempty("Campo obrigatório")
    .length(8, {
      message: "O código do usuário deve ter exatamente 8 caracteres",
    })
    .regex(/^[A-Z0-9]+$/, {
      message: "O código deve conter apenas letras maiúsculas e números",
    }),
});

// Esquema para validar os dados do usuário
export const userSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório."),
  code_name: z
    .string()
    .length(8, "O código deve ter exatamente 8 caracteres.")
    .regex(
      /^[A-Z0-9]+$/,
      "O código deve conter apenas letras maiúsculas e números."
    ),
});
