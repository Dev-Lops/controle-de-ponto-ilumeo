import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

// Constantes para mensagens de erro
const MESSAGES = {
  methodNotAllowed: 'Método não permitido',
  internalServerError: 'Erro interno no servidor',
  invalidData: 'Dados inválidos',
  userCodeRequired: 'userCode é obrigatório',
  userNotFound: 'Usuário não encontrado',
  timerDeleted: 'Timer removido com sucesso.',
};

/**
 * Manipula solicitações relacionadas ao timer.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ message: MESSAGES.methodNotAllowed });
    }
  } catch (error) {
    console.error('Erro no endpoint /api/timer:', error);
    return res.status(500).json({ message: MESSAGES.internalServerError });
  }
}

/**
 * Processa requisições GET para buscar o timer de um usuário.
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const userCode = validateQueryParam(req.query.userCode);

  if (!userCode) {
    return res.status(400).json({ message: MESSAGES.userCodeRequired });
  }

  // Verifica se o usuário existe no banco de dados
  const user = await prisma.user.findUnique({
    where: { code_name: userCode },
  });

  if (!user) {
    return res.status(404).json({ message: MESSAGES.userNotFound });
  }

  // Busca o timer associado ao usuário
  const timer = await prisma.timer.findUnique({
    where: { user_code: userCode },
  });

  return res.status(200).json(timer || { start_time: null });
}

/**
 * Processa requisições POST para criar ou atualizar um timer.
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { userCode, startTime } = req.body;

  if (!userCode || !startTime) {
    return res.status(400).json({ message: MESSAGES.invalidData });
  }

  const timer = await prisma.timer.upsert({
    where: { user_code: userCode },
    update: { start_time: new Date(startTime) },
    create: { user_code: userCode, start_time: new Date(startTime) },
  });

  return res.status(200).json(timer);
}

/**
 * Processa requisições DELETE para remover um timer.
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const userCode = validateQueryParam(req.query.userCode);

  if (!userCode) {
    return res.status(400).json({ message: MESSAGES.userCodeRequired });
  }

  await prisma.timer.delete({
    where: { user_code: userCode },
  });

  return res.status(200).json({ message: MESSAGES.timerDeleted });
}

/**
 * Valida e retorna um parâmetro de consulta como string.
 */
function validateQueryParam(param: unknown): string | null {
  return typeof param === 'string' && param.trim() !== '' ? param : null;
}
