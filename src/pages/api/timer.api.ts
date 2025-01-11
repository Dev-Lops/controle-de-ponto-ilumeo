import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "POST":
        return await handlePost(req, res);
      case "GET":
        return await handleGet(req, res);
      case "DELETE":
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API Timer:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { userCode, startTime } = req.body;

  if (!userCode || !startTime) {
    return res.status(400).json({ message: "userCode e startTime são obrigatórios" });
  }

  try {
    const timer = await prisma.timer.upsert({
      where: { user_code: userCode },
      update: { start_time: new Date(startTime) },
      create: { user_code: userCode, start_time: new Date(startTime) },
    });

    return res.status(200).json(timer);
  } catch (error) {
    console.error("Erro ao salvar timer:", error);
    return res.status(500).json({ message: "Erro ao salvar timer" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { userCode } = req.query;

  if (!userCode || typeof userCode !== "string") {
    return res.status(400).json({ message: "userCode é obrigatório" });
  }

  try {
    const timer = await prisma.timer.findUnique({
      where: { user_code: userCode },
    });

    if (!timer) {
      return res.status(404).json({ message: "Timer não encontrado" });
    }

    return res.status(200).json(timer);
  } catch (error) {
    console.error("Erro ao buscar timer:", error);
    return res.status(500).json({ message: "Erro ao buscar timer" });
  }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { userCode } = req.query;

  if (!userCode || typeof userCode !== "string") {
    return res.status(400).json({ message: "userCode é obrigatório" });
  }

  try {
    await prisma.timer.delete({
      where: { user_code: userCode },
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Erro ao deletar timer:", error);
    return res.status(500).json({ message: "Erro ao deletar timer" });
  }
}
