import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

// Constantes para validação e mensagens de erro
const MESSAGES = {
  methodNotAllowed: "Método não permitido",
  codeNameRequired: "Code Name é obrigatório",
  userNotFound: (codeName: string) =>
    `Usuário com code_name ${codeName} não encontrado.`,
  sessionExists: "Já existe uma sessão registrada para este dia.",
  internalServerError: "Erro interno no servidor",
  invalidData: "Dados inválidos",
};

/**
 * Manipula solicitações relacionadas às sessões de trabalho.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      await handleGet(req, res);
    } else if (req.method === "POST") {
      await handlePost(req, res);
    } else {
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ message: MESSAGES.methodNotAllowed });
    }
  } catch (error) {
    console.error("Erro na API de sessões:", error);
    return res.status(500).json({ message: MESSAGES.internalServerError });
  }
}

/**
 * Processa requisições GET para obter sessões de um usuário.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, page = "1", limit = "10" } = req.query;

  if (!codeName || typeof codeName !== "string") {
    return res.status(400).json({ message: MESSAGES.codeNameRequired });
  }

  const pageNumber = parsePositiveInt(page as string, 1);
  const pageSize = parsePositiveInt(limit as string, 10);

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res.status(404).json({ message: MESSAGES.userNotFound(codeName) });
    }

    const [sessions, totalSessions] = await Promise.all([
      prisma.workSession.findMany({
        where: { user_id: user.id },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { start_time: "desc" },
      }),
      prisma.workSession.count({ where: { user_id: user.id } }),
    ]);

    return res.status(200).json({
      sessions,
      total: totalSessions,
      page: pageNumber,
      totalPages: Math.ceil(totalSessions / pageSize),
    });
  } catch (error) {
    console.error("Erro ao buscar sessões:", error);
    return res.status(500).json({ message: MESSAGES.internalServerError });
  }
}

/**
 * Processa requisições POST para criar uma nova sessão de trabalho.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, startTime, endTime } = req.body;

  if (!codeName || !startTime) {
    return res.status(400).json({ message: MESSAGES.invalidData });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res.status(404).json({ message: MESSAGES.userNotFound(codeName) });
    }

    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : null;

    const sessionExists = await prisma.workSession.findFirst({
      where: {
        user_id: user.id,
        start_time: {
          gte: new Date(`${start.toISOString().split("T")[0]}T00:00:00Z`),
          lt: new Date(`${start.toISOString().split("T")[0]}T23:59:59Z`),
        },
      },
    });

    if (sessionExists) {
      return res.status(400).json({ message: MESSAGES.sessionExists });
    }

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
    return res.status(500).json({ message: MESSAGES.internalServerError });
  }
}

/**
 * Função utilitária para converter strings em números positivos.
 */
function parsePositiveInt(value: string, defaultValue: number): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) || parsed <= 0 ? defaultValue : parsed;
}
