import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Código do usuário inválido." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: code }, // Agora funciona com code_name único
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Erro ao buscar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
}
