import { useEffect, useState } from "react";
import { Session, SessionService } from "@/services/sessionService";
import { TimerStorage } from "@/utils/timerStorage";

export function useTimer(userCode: string) {
  const sessionService = new SessionService();
  const [isClockRunning, setIsClockRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState("0h 00m");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalDuration, setTotalDuration] = useState("0h 00m");
  const [loading, setLoading] = useState(true); // Estado de carregamento

  useEffect(() => {
    loadSessions();
    restoreTimerState(userCode);
  }, [userCode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isClockRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = sessionService.calculateDuration(startTime, now);
        setCurrentTime(elapsed);
        setTotalDuration(
          sessionService.calculateTotalDuration(
            sessions,
            now.getTime() - startTime.getTime()
          )
        );
      }, 1000);
    } else {
      setTotalDuration(sessionService.calculateTotalDuration(sessions, 0));
    }
    return () => clearInterval(interval);
  }, [isClockRunning, startTime, sessions]);

  const loadSessions = async () => {
    try {
      const { sessions } = await sessionService.fetchSessions(userCode);
      const formattedSessions = sessions.map((session) => {
        const start = new Date(session.start_time);
        const end = session.end_time ? new Date(session.end_time) : new Date();

        return {
          ...session,
          duration: sessionService.calculateDuration(start, end),
        };
      });

      setSessions(formattedSessions);
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    } finally {
      setLoading(false); // Finaliza o carregamento
    }
  };

  const restoreTimerState = (codeName: string) => {
    const savedStartTime = TimerStorage.getStartTime(codeName);
    if (savedStartTime) {
      setStartTime(savedStartTime);
      setIsClockRunning(true);
    }
    setLoading(false); // Finaliza o carregamento após verificar o estado
  };

  const toggleClock = async () => {
    if (isClockRunning) {
      const now = new Date();
      const sessionData = {
        codeName: userCode,
        startTime: startTime!.toISOString(),
        endTime: now.toISOString(),
      };

      try {
        const newSession = await sessionService.saveSession(sessionData);
        setSessions((prev) => [
          {
            ...newSession,
            duration: sessionService.calculateDuration(
              startTime!,
              new Date(newSession.end_time || Date.now())
            ),
          },
          ...prev,
        ]);
      } finally {
        setIsClockRunning(false);
        setStartTime(null);
        TimerStorage.clearStartTime(userCode);
        setCurrentTime("0h 00m");
      }
    } else {
      const now = new Date();
      setStartTime(now);
      setIsClockRunning(true);
      TimerStorage.saveStartTime(userCode, now);
    }
  };

  return {
    isClockRunning,
    currentTime,
    totalDuration,
    sessions,
    toggleClock,
    loading, // Retorna o estado de carregamento
  };
}
