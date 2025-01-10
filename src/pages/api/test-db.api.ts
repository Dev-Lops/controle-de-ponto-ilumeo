import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Erro de conexão:", error);
    res.status(500).json({ success: false, error });
  }
}
