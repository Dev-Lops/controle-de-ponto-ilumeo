import { api } from "@/lib/axios";

export interface Session {
  id: string;
  start_time: string;
  end_time: string | null;
  duration: string;
}

export class SessionService {
  async fetchSessions(codeName: string): Promise<Session[]> {
    const response = await api.get("/sessions", {
      params: { codeName },
    });
    return response.data;
  }

  async saveSession(session: {
    codeName: string;
    startTime: string;
    endTime: string;
  }): Promise<Session> {
    const response = await api.post("/sessions", session);
    return response.data;
  }

  calculateDuration(start: Date, end: Date): string {
    const elapsed = end.getTime() - start.getTime();
    const hours = Math.floor(elapsed / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  calculateTotalDuration(sessions: Session[], currentElapsed: number): string {
    let totalMilliseconds = sessions.reduce((acc, session) => {
      const start = new Date(session.start_time).getTime();
      const end = session.end_time
        ? new Date(session.end_time).getTime()
        : Date.now();
      return acc + (end - start);
    }, 0);

    totalMilliseconds += currentElapsed;

    const hours = Math.floor(totalMilliseconds / (1000 * 60 * 60));
    const minutes = Math.floor(
      (totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
    );
    return `${hours}h ${minutes}m`;
  }
}
