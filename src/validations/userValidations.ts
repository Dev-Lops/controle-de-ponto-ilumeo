import { z } from "zod";

// Validação básica de strings para reutilização
const stringField = (fieldName: string, min: number, max: number) =>
  z
    .string()
    .nonempty(`${fieldName} é obrigatório.`)
    .min(min, `${fieldName} deve ter no mínimo ${min} caracteres.`)
    .max(max, `${fieldName} deve ter no máximo ${max} caracteres.`);

// Validação genérica para códigos
const codeField = (fieldName: string, length: number) =>
  z
    .string()
    .length(length, `${fieldName} deve ter exatamente ${length} caracteres.`)
    .regex(
      /^[A-Z0-9]+$/,
      `${fieldName} deve conter apenas letras maiúsculas e números.`
    );

// Esquema para validar o código do usuário
export const userCodeSchema = z.object({
  codeUser: codeField("Código do usuário", 8),
});

// Esquema para validar os dados do usuário
export const userSchema = z.object({
  name: stringField("Nome", 1, 100), // Ajuste o máximo conforme necessário
  code_name: codeField("Código", 8),
});
