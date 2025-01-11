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
    if (!codeName) throw new Error("CodeName não pode ser vazio.");

    try {
      const response = await api.get(API_ENDPOINTS.FETCH_SESSIONS, {
        params: { codeName },
      });

      // Validação dos dados retornados
      if (!response.data.sessions || !Array.isArray(response.data.sessions)) {
        console.error("Resposta inesperada da API:", response.data);
        throw new Error("Formato da resposta da API não é válido.");
      }

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
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao buscar sessões:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message || "Erro ao buscar sessões no servidor."
        );
      } else {
        console.error("Erro desconhecido ao buscar sessões:", error);
        throw new Error("Erro desconhecido ao buscar sessões.");
      }
    }
  }

  /**
   * Salva uma nova sessão de trabalho.
   * @param session - Dados da sessão
   * @returns Sessão salva
   */
  async saveSession(session: CreateSessionInput): Promise<Session> {
    if (!session.codeName || !session.startTime || !session.endTime) {
      throw new Error("Dados da sessão estão incompletos.");
    }

    try {
      const response = await api.post("/sessions", session); 
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao salvar sessão no servidor:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message || "Erro ao salvar sessão no servidor."
        );
      } else {
        console.error("Erro desconhecido ao salvar sessão:", error);
        throw new Error("Erro desconhecido ao salvar sessão.");
      }
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

  private calculateElapsedTime(
    startTime: string,
    endTime: string | null
  ): number {
    const start = dayjs(startTime);
    const end = endTime ? dayjs(endTime) : dayjs();
    return end.diff(start);
  }

  private formatDuration(durationObj: Duration): string {
    const hours = Math.floor(durationObj.asHours());
    const minutes = durationObj.minutes();
    return `${hours}h ${minutes}m`;
  }
}
