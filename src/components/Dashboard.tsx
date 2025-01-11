import React from "react";
import { SessionsByDay } from "@/components/sessionsByDays";
import { UserChart } from "@/components/usersCharts";
import { Session } from "@/services/sessionService";

interface DashboardProps {
  sessions: Session[];
}

export function Dashboard({ sessions }: DashboardProps) {
  const normalizedSessions = sessions.map((session) => ({
    start_time: session.start_time,
    duration: session.duration || "0h 0m", // Garantir que duration nunca seja undefined
  }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6">
        Dashboard do Usuário
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gráfico */}
        <UserChart sessions={normalizedSessions} />

        {/* Lista de Sessões */}
        <div>
          <h2 className="text-xl font-bold mb-4">Sessões</h2>
          <SessionsByDay sessions={sessions} />
        </div>
      </div>
    </div>
  );
}
