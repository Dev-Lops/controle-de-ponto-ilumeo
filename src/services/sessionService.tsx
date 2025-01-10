import { api } from "@/lib/axios";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  duration: string;
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
  async fetchSessions(codeName: string): Promise<Session[]> {
    if (!codeName) throw new Error("CodeName não pode ser vazio.");

    try {
      const response = await api.get(API_ENDPOINTS.FETCH_SESSIONS, {
        params: { codeName },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar sessões:", error);
      throw new Error("Não foi possível buscar sessões.");
    }
  }

  async saveSession(session: CreateSessionInput): Promise<Session> {
    if (!session.codeName || !session.startTime || !session.endTime) {
      throw new Error("Dados da sessão estão incompletos.");
    }

    try {
      const response = await api.post(API_ENDPOINTS.SAVE_SESSION, session);
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
      throw new Error("Não foi possível salvar a sessão.");
    }
  }

  calculateDuration(start: Date, end: Date): string {
    const durationObj = dayjs.duration(dayjs(end).diff(dayjs(start)));
    return this.formatDuration(durationObj);
  }

  calculateTotalDuration(sessions: Session[], currentElapsed: number): string {
    const totalMilliseconds = sessions.reduce((acc, session) => {
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
