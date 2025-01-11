import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Manipula solicitações relacionadas às sessões de trabalho.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      return handleGet(req, res);
    }
    return res.status(405).json({ message: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de sessões:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

/**
 * Processa requisições GET para obter sessões de um usuário.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, page = "1", limit = "10" } = req.query;

  if (!codeName || typeof codeName !== "string") {
    return res.status(400).json({ message: "Code Name é obrigatório" });
  }

  const pageNumber = parseInt(page as string, 10);
  const pageSize = parseInt(limit as string, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: `Usuário com code_name ${codeName} não encontrado.` });
    }

    const sessions = await prisma.workSession.findMany({
      where: { user_id: user.id },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      orderBy: { start_time: "desc" },
    });

    const totalSessions = await prisma.workSession.count({
      where: { user_id: user.id },
    });

    return res.status(200).json({
      sessions,
      total: totalSessions,
      page: pageNumber,
      totalPages: Math.ceil(totalSessions / pageSize),
    });
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}
