import { api } from '@/lib/axios';
import axios from 'axios';

interface TimerResponse {
  start_time?: string;
}

export class TimerStorage {
  /**
   * Salva o horário de início do timer no servidor.
   * @param userCode Código do usuário.
   * @param startTime Data e hora do início.
   */
  static async saveStartTime(userCode: string, startTime: Date): Promise<void> {
    if (!userCode) {
      throw new Error('O código do usuário (userCode) é obrigatório.');
    }

    try {
      await api.post('/timer', {
        userCode,
        startTime: startTime.toISOString(),
      });
      console.log(
        `Timer salvo com sucesso para ${userCode}, start_time: ${startTime.toISOString()}`
      );
    } catch (error) {
      TimerStorage.handleError('Erro ao salvar startTime no servidor.', error);
    }
  }

  /**
   * Busca o horário de início do timer do servidor.
   * @param userCode Código do usuário.
   * @returns Data do horário de início ou null, caso não encontrado.
   */
  static async getStartTime(userCode: string): Promise<Date | null> {
    if (!userCode) {
      throw new Error('O código do usuário (userCode) é obrigatório.');
    }

    try {
      const response = await api.get<TimerResponse>('/timer', {
        params: { userCode },
      });

      if (!response.data.start_time) {
        console.log(`Nenhum timer ativo encontrado para o código ${userCode}`);
        return null;
      }

      return new Date(response.data.start_time);
    } catch (error) {
      TimerStorage.handleError('Erro ao buscar startTime no servidor.', error);
    }
    return null; // Retorna null em caso de erro
  }

  /**
   * Remove o horário de início do timer do servidor.
   * @param userCode Código do usuário.
   */
  static async clearStartTime(userCode: string): Promise<void> {
    if (!userCode) {
      throw new Error('O código do usuário (userCode) é obrigatório.');
    }

    try {
      await api.delete('/timer', { params: { userCode } });
      console.log(`Timer para ${userCode} foi removido com sucesso.`);
    } catch (error) {
      TimerStorage.handleError('Erro ao limpar startTime no servidor.', error);
    }
  }

  /**
   * Lida com erros de requisições e fornece mensagens detalhadas.
   * @param defaultMessage Mensagem de erro padrão.
   * @param error Erro capturado.
   */
  private static handleError(defaultMessage: string, error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error(
        `${defaultMessage}:`,
        error.response?.data || error.message
      );
      throw new Error(error.response?.data?.message || defaultMessage);
    } else {
      console.error(`${defaultMessage}: Erro desconhecido`, error);
      throw new Error('Erro desconhecido ao processar a solicitação.');
    }
  }
}
