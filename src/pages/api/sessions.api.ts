import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
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
          .json({
            message: `Usuário com code_name ${codeName} não encontrado.`,
          });
      }

      return res.status(200).json(user.sessions);
    }

    if (req.method === "POST") {
      const { codeName, startTime, endTime } = req.body;
      if (!codeName || !startTime || !endTime) {
        return res.status(400).json({ message: "Dados inválidos" });
      }

      const user = await prisma.user.findUnique({
        where: { code_name: codeName },
      });

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

    return res.status(405).json({ message: "Método não permitido" });
  } catch (error) {
    console.error("Erro na API de sessões:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
}
