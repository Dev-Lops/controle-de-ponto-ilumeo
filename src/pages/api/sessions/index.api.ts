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
    switch (req.method) {
      case "GET":
        return handleGet(req, res);
      case "POST":
        return handlePost(req, res);
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ message: "Método não permitido" });
    }
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

/**
 * Processa requisições POST para criar uma nova sessão de trabalho.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, startTime, endTime } = req.body;

  if (!codeName || !startTime) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    // Verificar se já existe uma sessão para o dia atual
    const existingSession = await prisma.workSession.findFirst({
      where: {
        user_id: user.id,
        start_time: {
          gte: new Date(start.toISOString().split("T")[0] + "T00:00:00Z"),
          lt: new Date(start.toISOString().split("T")[0] + "T23:59:59Z"),
        },
      },
    });

    if (existingSession) {
      return res.status(400).json({
        message: "Já existe uma sessão registrada para este dia.",
      });
    }

    const duration = end
      ? Math.floor((end.getTime() - start.getTime()) / (1000 * 60))
      : null;

    const session = await prisma.workSession.create({
      data: {
        user_id: user.id,
        start_time: start,
        end_time: end,
      },
    });

    return res.status(201).json(session);
  } catch (error) {
    console.error("Erro ao salvar sessão:", error);
    return res.status(500).json({ message: "Erro ao salvar sessão." });
  }
}
