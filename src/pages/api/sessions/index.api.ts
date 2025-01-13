import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

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
      return res
        .status(405)
        .json({ success: false, message: "Método não permitido." });
    }
  } catch (error) {
    console.error("Erro no endpoint de sessões:", error);
    return res
      .status(500)
      .json({ success: false, message: "Erro interno no servidor." });
  }
}

/**
 * Retorna as sessões de trabalho de um usuário.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, page = "1", limit = "10" } = req.query;

  if (!codeName || typeof codeName !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Code Name é obrigatório." });
  }

  const pageNumber = parseInt(page as string, 10) || 1;
  const pageSize = parseInt(limit as string, 10) || 10;

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuário não encontrado: ${codeName}`,
      });
    }

    const [sessions, total] = await Promise.all([
      prisma.workSession.findMany({
        where: { user_id: user.id },
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        orderBy: { start_time: "desc" },
      }),
      prisma.workSession.count({ where: { user_id: user.id } }),
    ]);

    return res.status(200).json({
      success: true,
      data: sessions,
      meta: {
        total,
        page: pageNumber,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Erro ao buscar sessões para:", codeName, error);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao buscar sessões." });
  }
}

/**
 * Cria uma nova sessão de trabalho.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, startTime, endTime } = req.body;

  if (!codeName || !startTime) {
    return res
      .status(400)
      .json({ success: false, message: "Dados incompletos." });
  }

  if (isNaN(new Date(startTime).getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Data de início inválida." });
  }

  if (endTime && isNaN(new Date(endTime).getTime())) {
    return res
      .status(400)
      .json({ success: false, message: "Data de fim inválida." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: codeName },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: `Usuário não encontrado: ${codeName}`,
      });
    }

    const session = await prisma.workSession.create({
      data: {
        user_id: user.id,
        start_time: new Date(startTime),
        end_time: endTime ? new Date(endTime) : null,
      },
    });

    return res.status(201).json({ success: true, data: session });
  } catch (error) {
    console.error("Erro ao criar sessão para:", codeName, error);
    return res
      .status(500)
      .json({ success: false, message: "Erro ao criar sessão." });
  }
}
