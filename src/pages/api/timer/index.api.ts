import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      return handleGet(req, res);
    }

    if (req.method === "POST") {
      return handlePost(req, res);
    }

    if (req.method === "DELETE") {
      return handleDelete(req, res);
    }

    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).json({ message: "Método não permitido" });
  } catch (error) {
    console.error("Erro no endpoint /api/timer:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { userCode } = req.query;

  if (!userCode || typeof userCode !== "string") {
    return res.status(400).json({ message: "userCode é obrigatório" });
  }

  const timer = await prisma.timer.findUnique({
    where: { user_code: userCode },
  });

  if (!timer) {
    return res.status(200).json({ start_time: null });
  }

  return res.status(200).json(timer);
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { userCode, startTime } = req.body;

  if (!userCode || !startTime) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  const timer = await prisma.timer.upsert({
    where: { user_code: userCode },
    update: { start_time: new Date(startTime) },
    create: { user_code: userCode, start_time: new Date(startTime) },
  });

  return res.status(200).json(timer);
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { userCode } = req.query;

  if (!userCode || typeof userCode !== "string") {
    return res.status(400).json({ message: "userCode é obrigatório" });
  }

  await prisma.timer.delete({
    where: { user_code: userCode },
  });

  return res.status(200).json({ message: "Timer removido com sucesso." });
}
