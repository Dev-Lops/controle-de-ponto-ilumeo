import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, code_name } = req.body;

    if (!name || !code_name) {
      return res
        .status(400)
        .json({ error: "Nome e código do usuário são obrigatórios." });
    }

    try {
      const user = await prisma.user.create({
        data: { name, code_name },
      });

      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({ error: "Erro ao criar usuário." });
    }
  }

  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Método ${req.method} não permitido`);
}
