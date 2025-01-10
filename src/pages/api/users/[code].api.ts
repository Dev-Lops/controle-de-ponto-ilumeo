import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

/**
 * Manipula solicitações para buscar usuários por code_name.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Método não permitido." });
    }

    const code = Array.isArray(req.query.code)
      ? req.query.code[0]
      : req.query.code;

    if (!code || typeof code !== "string") {
      return res.status(400).json({ error: "Código do usuário inválido." });
    }

    const user = await findUserByCodeName(code);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(
      "Erro ao buscar usuário:",
      error instanceof Error ? error.message : error
    );
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}

/**
 * Busca um usuário no banco de dados pelo code_name.
 * @param codeName - O code_name único do usuário.
 */
async function findUserByCodeName(codeName: string) {
  try {
    await prisma.$connect(); // Garante que o Prisma está conectado
    return prisma.user.findUnique({
      where: { code_name: codeName },
    });
  } finally {
    await prisma.$disconnect(); // Fecha a conexão após a consulta
  }
}
