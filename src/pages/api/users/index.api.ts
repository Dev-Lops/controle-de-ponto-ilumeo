import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'POST':
        return await UserController.createUser(req, res);
      case 'GET':
        return await UserController.checkUserExists(req, res);
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({ message: 'Método não permitido' });
    }
  } catch (error) {
    console.error('Erro na API de usuários:', error);
    return res.status(500).json({ message: 'Erro interno no servidor.' });
  }
}

/**
 * Controlador de Usuários
 */
class UserController {
  /**
   * Cria um novo usuário.
   */
  static async createUser(req: NextApiRequest, res: NextApiResponse) {
    const { name, code_name } = req.body;

    if (!name || !code_name) {
      return res
        .status(400)
        .json({ message: 'Nome e código são obrigatórios.' });
    }

    try {
      const existingUser = await UserService.getUserByCode(code_name);
      if (existingUser) {
        return res
          .status(409)
          .json({ message: 'Já existe um usuário com este código.' });
      }

      const user = await UserService.createUser({ name, code_name });
      return res.status(201).json(user);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }

  /**
   * Verifica se um usuário existe.
   */
  static async checkUserExists(req: NextApiRequest, res: NextApiResponse) {
    const { code_name } = req.query;

    if (!code_name || typeof code_name !== 'string') {
      return res.status(400).json({ message: 'Code Name é obrigatório.' });
    }

    try {
      const exists = await UserService.checkUserExists(code_name);
      return res.status(200).json({ exists });
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
  }
}

/**
 * Serviço de Usuários
 */
class UserService {
  /**
   * Cria um novo usuário no banco de dados.
   */
  static async createUser(data: { name: string; code_name: string }) {
    try {
      return await prisma.user.create({ data });
    } catch (error) {
      console.error('Erro ao salvar o usuário no banco:', error);
      throw new Error('Erro ao criar o usuário no banco de dados.');
    }
  }

  /**
   * Busca um usuário pelo código único.
   */
  static async getUserByCode(code_name: string) {
    return prisma.user.findUnique({ where: { code_name } });
  }

  /**
   * Verifica se um usuário existe.
   */
  static async checkUserExists(code_name: string): Promise<boolean> {
    const user = await this.getUserByCode(code_name);
    return Boolean(user);
  }
}
