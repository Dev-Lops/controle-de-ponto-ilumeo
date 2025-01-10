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
  const { codeName } = req.query;

  if (!codeName || typeof codeName !== "string") {
    return res.status(400).json({ message: "Code Name é obrigatório" });
  }

  const user = await prisma.user.findUnique({
    where: { code_name: codeName },
    include: { sessions: true },
  });

  if (!user) {
    return res
      .status(404)
      .json({ message: `Usuário com code_name ${codeName} não encontrado.` });
  }

  return res.status(200).json(user.sessions);
}

/**
 * Processa requisições POST para criar uma nova sessão de trabalho.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { codeName, startTime, endTime } = req.body;

  if (!codeName || !startTime || !endTime) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const user = await prisma.user.findUnique({
    where: { code_name: codeName },
  });
  await prisma.$disconnect(); // Fecha conexão

  if (!user) {
    return res.status(404).json({ message: "Usuário não encontrado" });
  }

  const session = await prisma.workSession.create({
    data: {
      user_id: user.id,
      start_time: new Date(startTime),
      end_time: new Date(endTime),
    },
  });

  return res.status(201).json(session);
}
