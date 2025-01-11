import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userCode } = req.query;

    if (!userCode || typeof userCode !== "string") {
      return res
        .status(400)
        .json({ message: "O código do usuário é obrigatório" });
    }

    switch (req.method) {
      case "GET":
        return await handleGet(userCode, res);
      case "POST":
        return await handlePost(userCode, req.body.startTime, res);
      case "DELETE":
        return await handleDelete(userCode, res);
      default:
        return res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de Timer:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

async function handleGet(userCode: string, res: NextApiResponse) {
  const timer = await prisma.timer.findUnique({
    where: { user_code: userCode },
  });

  if (!timer) {
    return res.status(404).json({ message: "Nenhum timer encontrado" });
  }

  return res.status(200).json({ startTime: timer.start_time });
}

async function handlePost(
  userCode: string,
  startTime: string,
  res: NextApiResponse
) {
  if (!startTime) {
    return res.status(400).json({ message: "startTime é obrigatório" });
  }

  const timer = await prisma.timer.upsert({
    where: { user_code: userCode },
    update: { start_time: new Date(startTime) },
    create: { user_code: userCode, start_time: new Date(startTime) },
  });

  return res.status(200).json(timer);
}

async function handleDelete(userCode: string, res: NextApiResponse) {
  await prisma.timer.delete({
    where: { user_code: userCode },
  });

  return res.status(204).end();
}
