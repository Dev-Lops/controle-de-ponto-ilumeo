import { useEffect, useState } from "react";
import { Session, SessionService } from "@/services/sessionService";
import { TimerStorage } from "@/utils/timerStorage";

export function useTimer(userCode: string) {
  // Verificação inicial para evitar execução desnecessária
  const isValidUserCode =
    typeof userCode === "string" && userCode.trim().length > 0;

  const sessionService = new SessionService();

  const [isClockRunning, setIsClockRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState("0h 00m");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalDuration, setTotalDuration] = useState("0h 00m");
  const [loading, setLoading] = useState(isValidUserCode);

  useEffect(() => {
    // Apenas inicializa se o userCode for válido
    if (isValidUserCode) {
      initializeTimer();
    } else {
      console.warn("O código do usuário (userCode) é inválido ou ausente.");
      setLoading(false);
    }
  }, [userCode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isClockRunning && startTime) {
      interval = setInterval(() => updateCurrentDuration(), 1000);
    } else {
      setTotalDuration(sessionService.calculateTotalDuration(sessions, 0));
    }

    return () => clearInterval(interval);
  }, [isClockRunning, startTime, sessions]);

  const initializeTimer = async () => {
    try {
      await loadSessions();
      await restoreTimerState();
    } catch (error) {
      console.error("Erro durante a inicialização do timer:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const { sessions } = await sessionService.fetchSessions(userCode);
      setSessions(sessions.map(formatSession));
    } catch (error) {
      console.error("Erro ao carregar sessões:", error);
    }
  };

  const restoreTimerState = async () => {
    try {
      const savedStartTime = await TimerStorage.getStartTime(userCode);
      if (savedStartTime) {
        setStartTime(savedStartTime);
        setIsClockRunning(true);
      }
    } catch (error) {
      console.error("Erro ao restaurar o estado do timer:", error);
    }
  };

  const toggleClock = async () => {
    if (isClockRunning) {
      await stopClock();
    } else {
      await startClock();
    }
  };

  const startClock = async () => {
    const now = new Date();
    setStartTime(now);
    setIsClockRunning(true);
    await TimerStorage.saveStartTime(userCode, now);
  };

  const stopClock = async () => {
    const now = new Date();
    const sessionData = {
      codeName: userCode,
      startTime: startTime!.toISOString(),
      endTime: now.toISOString(),
    };

    try {
      const newSession = await sessionService.saveSession(sessionData);
      setSessions((prev) => [formatSession(newSession), ...prev]);
    } finally {
      resetClockState();
    }
  };

  const resetClockState = async () => {
    setIsClockRunning(false);
    setStartTime(null);
    setCurrentTime("0h 00m");
    await TimerStorage.clearStartTime(userCode);
  };

  const updateCurrentDuration = () => {
    const now = new Date();
    const elapsed = sessionService.calculateDuration(startTime!, now);
    setCurrentTime(elapsed);
    setTotalDuration(
      sessionService.calculateTotalDuration(
        sessions,
        now.getTime() - startTime!.getTime()
      )
    );
  };

  const formatSession = (session: Session): Session => {
    const start = new Date(session.start_time);
    const end = session.end_time ? new Date(session.end_time) : new Date();
    return {
      ...session,
      duration: calculatePreciseDuration(start, end),
    };
  };

  const calculatePreciseDuration = (start: Date, end: Date): string => {
    const diffMs = end.getTime() - start.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return isValidUserCode
    ? {
        isClockRunning,
        currentTime,
        totalDuration,
        sessions,
        toggleClock,
        loading,
      }
    : {
        isClockRunning: false,
        currentTime: "0h 00m",
        totalDuration: "0h 00m",
        sessions: [],
        toggleClock: async () => {},
        loading: false,
      };
}
