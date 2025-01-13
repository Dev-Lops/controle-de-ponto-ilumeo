import React from "react";
import dayjs from "dayjs";
import { Session } from "@/services/sessionService";

interface SessionsByDayProps {
  sessions: Session[];
}

/**
 * Agrupa sessões por data.
 * @param sessions - Lista de sessões
 * @returns Objeto agrupado por data
 */
const groupSessionsByDate = (
  sessions: Session[]
): Record<string, Session[]> => {
  return sessions.reduce((acc: Record<string, Session[]>, session) => {
    const date = dayjs(session.start_time).format("YYYY-MM-DD");
    if (!acc[date]) acc[date] = [];
    acc[date].push(session);
    return acc;
  }, {});
};

/**
 * Componente para exibir sessões individuais.
 */
const SessionItem: React.FC<{ session: Session }> = ({ session }) => {
  const startTime = dayjs(session.start_time).format("HH:mm");
  const endTime = session.end_time
    ? dayjs(session.end_time).format("HH:mm")
    : "Ativo";
  const duration = session.duration || "N/A";

  return (
    <li className="flex justify-between p-2 rounded">
      <span>
        De: {startTime} - Até: {endTime}
      </span>
      <span>Horas: {duration}</span>
    </li>
  );
};

/**
 * Componente para exibir sessões agrupadas por dia.
 */
const DayGroup: React.FC<{ date: string; sessions: Session[] }> = ({
  date,
  sessions,
}) => {
  return (
    <div className="border bg-input p-4 rounded shadow-sm">
      <h2 className="text-lg font-bold mb-2">
        {dayjs(date).format("DD/MM/YYYY")}
      </h2>
      <ul className="space-y-2">
        {sessions.map((session) => (
          <SessionItem key={session.id} session={session} />
        ))}
      </ul>
    </div>
  );
};

/**
 * Componente principal para exibir sessões por dia.
 */
export const SessionsByDay: React.FC<SessionsByDayProps> = ({ sessions }) => {
  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="space-y-4">
      {Object.entries(groupedSessions).map(([date, daySessions]) => (
        <DayGroup key={date} date={date} sessions={daySessions} />
      ))}
    </div>
  );
};
