import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { ButtonComponent } from "@/components/button";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Session, SessionService } from "@/services/sessionService";
import { ArrowCircleLeft } from "@phosphor-icons/react";

// Utils para manipulação do localStorage
const TimerStorage = {
  saveStartTime: (startTime: Date) =>
    localStorage.setItem("timerStartTime", startTime.toISOString()),
  getStartTime: (): Date | null => {
    const savedTime = localStorage.getItem("timerStartTime");
    return savedTime ? new Date(savedTime) : null;
  },
  clearStartTime: () => localStorage.removeItem("timerStartTime"),
};

interface UserPageProps {
  user: {
    id: string;
    name: string;
    code_name: string;
    createdAt: string;
  } | null;
}

export default function UserPage({ user }: UserPageProps) {
  const router = useRouter();
  const sessionService = new SessionService();

  const [isClockRunning, setIsClockRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [currentTime, setCurrentTime] = useState("0h 00m");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [totalDuration, setTotalDuration] = useState("0h 00m");

  // Carrega sessões e restaura o estado do timer
  useEffect(() => {
    if (user) {
      loadSessions();
      restoreTimerState();
    }
  }, [user]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isClockRunning && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = now.getTime() - startTime.getTime();
        setCurrentTime(sessionService.calculateDuration(startTime, now));
        setTotalDuration(
          sessionService.calculateTotalDuration(sessions, elapsed)
        );
      }, 1000);
    } else {
      setTotalDuration(sessionService.calculateTotalDuration(sessions, 0));
    }
    return () => clearInterval(interval);
  }, [isClockRunning, startTime, sessions]);

  const loadSessions = async () => {
    if (!user?.code_name) {
      console.error("Erro: Usuário ou código do usuário não definido.");
      return;
    }

    try {
      const fetchedSessions = await sessionService.fetchSessions(
        user.code_name
      );
      const formattedSessions = fetchedSessions.map((session) => {
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
    }
  };

  const handleClockToggle = async () => {
    if (isClockRunning) {
      const now = new Date();
      const sessionData = {
        codeName: user!.code_name,
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
              newSession.end_time ? new Date(newSession.end_time) : new Date()
            ),
          },
          ...prev,
        ]);
      } catch (error) {
        console.error("Erro ao salvar sessão:", error);
      } finally {
        setIsClockRunning(false);
        setStartTime(null);
        TimerStorage.clearStartTime();
        setCurrentTime("0h 00m");
      }
    } else {
      const now = new Date();
      setStartTime(now);
      setIsClockRunning(true);
      TimerStorage.saveStartTime(now);
    }
  };

  const restoreTimerState = () => {
    const savedStartTime = TimerStorage.getStartTime();
    if (savedStartTime) {
      setStartTime(savedStartTime);
      setIsClockRunning(true);
    }
  };

  const navigateHome = () => router.push("/");

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">Usuário não encontrado.</p>
        <ButtonComponent
          text="Retornar à Home"
          onClick={navigateHome}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-[365px] items-center justify-between pt-20 m-auto">
      <header className="flex justify-between mb-6 w-full items-center">
        <ButtonComponent
          onClick={navigateHome}
          text={<ArrowCircleLeft size={32} />}
          className="bg-transparent text-orange-400 hover:bg-transparent hover:text-orange-600 "
        />
        <h1 className="text-sm font-semibold">Relógio de ponto</h1>
        <div className="flex flex-col items-center text-xs">
          <p className="font-bold">#{user.code_name}</p>
          <p className="font-light">{user.name}</p>
        </div>
      </header>
      <div className="flex flex-col items-start w-full pb-4">
        <div className="flex items-center gap-2">
          <p className="text-3xl font-bold">{currentTime}</p>
          {isClockRunning && (
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          )}
        </div>
        <p className="text-xs pb-2">Horas de hoje</p>
        <div className="flex w-full text-sm justify-between mb-3">
          <p>Horas totais</p>
          <span className="text-orange-400">{totalDuration}</span>
        </div>
        <ButtonComponent
          text={isClockRunning ? "Hora de saída" : "Hora de entrada"}
          onClick={handleClockToggle}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black"
        />
      </div>
      <main className="flex flex-col w-full">
        <h3 className="text-start mb-2 font-semibold">Dias anteriores</h3>
        {sessions.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {sessions.map((session) => (
              <li
                key={session.id}
                className="flex justify-between items-center p-2 bg-input rounded-sm"
              >
                <p>{new Date(session.start_time).toLocaleDateString()}</p>
                <p>{session.duration}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Nenhum registro encontrado.
          </p>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  const { code } = context.params!;

  try {
    const user = await prisma.user.findUnique({
      where: { code_name: String(code) },
    });

    if (!user) {
      return { props: { user: null } };
    }

    return {
      props: {
        user: {
          ...user,
          createdAt: user.createdAt.toISOString(),
        },
      },
    };
  } catch (error) {
    console.error(`Erro ao buscar usuário com code_name ${code}:`, error);
    return { props: { user: null } };
  }
};
