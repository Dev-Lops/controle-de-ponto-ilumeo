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
  const [loading, setLoading] = useState(true);

  const resetTimerState = () => {
    setIsClockRunning(false); // Para o contador
    setStartTime(null); // Limpa o horário inicial
    setCurrentTime("0h 00m"); // Reseta o contador
  };

  useEffect(() => {
    if (userCode) {
      initializeTimer();
    }
  }, [userCode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isClockRunning && startTime) {
      interval = setInterval(() => {
        updateCurrentDuration();
        updateTotalDuration();
      }, 1000);
    } else {
      updateTotalDuration();
    }

    return () => clearInterval(interval);
  }, [isClockRunning, startTime, sessions]);

  const initializeTimer = async () => {
    try {
      const { sessions } = await sessionService.fetchSessions(userCode);
      setSessions(sessions);
      const savedStartTime = await TimerStorage.getStartTime(userCode);
      if (savedStartTime) {
        setStartTime(savedStartTime);
        setIsClockRunning(true);
      }
    } catch (error) {
      console.error("Erro ao inicializar timer:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleClock = async () => {
    if (isClockRunning) {
      await stopClock(); // Para o relógio e reseta
    } else {
      await startClock(); // Inicia o relógio
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
      id: `${Date.now()}`, // ID temporário
      codeName: userCode,
      start_time: startTime!.toISOString(), // Ajuste para start_time
      end_time: now.toISOString(), // Ajuste para end_time
      duration: sessionService.calculateDuration(startTime!, now),
    };

    try {
      await sessionService.saveSession({
        codeName: userCode,
        startTime: startTime!.toISOString(),
        endTime: now.toISOString(),
      });

      // Adicione ao estado garantindo o tipo correto
      setSessions((prev) => [sessionData, ...prev]);
    } catch (error) {
      console.error("Erro ao salvar sessão:", error);
    } finally {
      resetTimerState(); // Reseta o timer após salvar
    }
  };

  const updateCurrentDuration = () => {
    if (!startTime) return;
    const now = new Date();
    const elapsed = sessionService.calculateDuration(startTime, now);
    setCurrentTime(elapsed);
  };

  const updateTotalDuration = () => {
    const elapsedMilliseconds = startTime
      ? new Date().getTime() - startTime.getTime()
      : 0;
    const total = sessionService.calculateTotalDuration(
      sessions,
      elapsedMilliseconds
    );
    setTotalDuration(total);
  };

  return {
    isClockRunning,
    currentTime,
    totalDuration,
    sessions,
    toggleClock,
    loading,
  };
}
