import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * Manipula solicitações relacionadas aos usuários.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        return handlePost(req, res);
      case "GET":
        return handleGet(req, res);
      default:
        return res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error) {
    console.error("Erro na API de usuários:", error);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
}

/**
 * Processa requisições POST para criar um novo usuário.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { name, code_name } = req.body;

  if (!name || !code_name) {
    return res.status(400).json({ message: "Nome e código são obrigatórios." });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { code_name },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Já existe um usuário com este código." });
    }

    const user = await prisma.user.create({
      data: { name, code_name },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}

/**
 * Processa requisições GET para verificar a existência de um usuário.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { code_name } = req.query;

  if (!code_name || typeof code_name !== "string") {
    return res.status(400).json({ message: "Code Name é obrigatório." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { code_name },
    });

    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
}
