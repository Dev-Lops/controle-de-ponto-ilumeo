import { api } from "@/lib/axios";
import axios from "axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  duration?: string; // Campo opcional para formatar a duração no cliente
}

export interface CreateSessionInput {
  codeName: string;
  startTime: string;
  endTime: string;
}

const API_ENDPOINTS = {
  FETCH_SESSIONS: "/sessions",
  SAVE_SESSION: "/sessions",
};

type Duration = ReturnType<typeof dayjs.duration>;

export class SessionService {
  /**
   * Busca sessões de trabalho do usuário.
   * @param codeName - Código único do usuário
   * @returns Lista de sessões e metadados
   */
  async fetchSessions(
    codeName: string
  ): Promise<{ sessions: Session[]; total: number }> {
    if (this.isEmptyString(codeName)) {
      throw new Error("O código do usuário (codeName) não pode ser vazio.");
    }

    try {
      const response = await api.get(API_ENDPOINTS.FETCH_SESSIONS, {
        params: { codeName },
      });

      this.validateResponse(response);

      return {
        sessions: response.data.sessions.map((session: Session) => ({
          ...session,
          duration: session.end_time
            ? this.calculateDuration(
                new Date(session.start_time),
                new Date(session.end_time)
              )
            : undefined,
        })),
        total: response.data.total || 0,
      };
    } catch (error) {
      this.handleError(error, "Erro ao buscar sessões");
    }
  }

  /**
   * Salva uma nova sessão de trabalho.
   * @param session - Dados da sessão
   * @returns Sessão salva
   */
  async saveSession(session: CreateSessionInput): Promise<Session> {
    this.validateSessionInput(session);

    try {
      const response = await api.post(API_ENDPOINTS.SAVE_SESSION, session);
      this.validateResponse(response);
      return response.data;
    } catch (error) {
      this.handleError(error, "Erro ao salvar sessão");
    }
  }

  /**
   * Verifica se uma string está vazia.
   * @param value - String a ser verificada
   * @returns `true` se estiver vazia, caso contrário `false`
   */
  private isEmptyString(value: string): boolean {
    return !value || typeof value !== "string" || value.trim() === "";
  }

  /**
   * Valida a resposta da API.
   * @param response - Resposta da API
   */
  private validateResponse(response: any): void {
    if (!response || !response.data) {
      throw new Error("Resposta da API está inválida ou vazia.");
    }
  }

  /**
   * Valida os dados da sessão antes do envio.
   * @param session - Dados da sessão
   */
  private validateSessionInput(session: CreateSessionInput): void {
    const { codeName, startTime, endTime } = session;

    if (
      this.isEmptyString(codeName) ||
      this.isEmptyString(startTime) ||
      this.isEmptyString(endTime)
    ) {
      throw new Error("Os dados da sessão estão incompletos ou inválidos.");
    }
  }

  /**
   * Calcula a duração entre dois horários.
   * @param start - Hora inicial
   * @param end - Hora final
   * @returns String formatada da duração
   */
  calculateDuration(start: Date, end: Date): string {
    const durationObj = dayjs.duration(dayjs(end).diff(dayjs(start)));
    return this.formatDuration(durationObj);
  }

  /**
   * Calcula a duração total de todas as sessões.
   * @param sessions - Lista de sessões
   * @param currentElapsed - Tempo atual (opcional)
   * @returns String formatada da duração total
   */
  calculateTotalDuration(
    sessions: Session[],
    currentElapsed: number = 0
  ): string {
    const totalMilliseconds = sessions.reduce((acc, session) => {
      if (!session.start_time || !session.end_time) return acc;
      return (
        acc + this.calculateElapsedTime(session.start_time, session.end_time)
      );
    }, currentElapsed);

    return this.formatDuration(dayjs.duration(totalMilliseconds));
  }

  /**
   * Calcula o tempo decorrido entre dois horários.
   * @param startTime - Hora inicial
   * @param endTime - Hora final
   * @returns Tempo decorrido em milissegundos
   */
  private calculateElapsedTime(
    startTime: string,
    endTime: string | null
  ): number {
    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    return end.diff(start);
  }

  /**
   * Formata uma duração para uma string legível.
   * @param durationObj - Objeto de duração do Day.js
   * @returns Duração formatada
   */
  private formatDuration(durationObj: Duration): string {
    const hours = Math.floor(durationObj.asHours());
    const minutes = durationObj.minutes();
    return `${hours}h ${minutes}m`;
  }

  /**
   * Trata erros de forma consistente.
   * @param error - Erro capturado
   * @param defaultMessage - Mensagem de erro padrão
   */
  private handleError(error: unknown, defaultMessage: string): never {
    if (axios.isAxiosError(error)) {
      console.error(defaultMessage, error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || `${defaultMessage} no servidor.`
      );
    } else {
      console.error(defaultMessage, error);
      throw new Error(`${defaultMessage}.`);
    }
  }
}
