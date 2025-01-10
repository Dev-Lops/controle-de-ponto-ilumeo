import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Tenta conectar ao banco de dados
    await prisma.$connect();
    res.status(200).json({ message: "Conexão bem-sucedida!" });
  } catch (error) {
    console.error("Erro ao conectar ao banco:", error);
    res.status(500).json({
      error: "Erro ao conectar no banco",
      details: error instanceof Error ? error.message : error,
    });
  }
}
