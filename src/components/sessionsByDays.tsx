import React from "react";
import dayjs from "dayjs";
import { Session } from "@/services/sessionService";

interface SessionsByDayProps {
  sessions: Session[];
}

export const SessionsByDay: React.FC<SessionsByDayProps> = ({ sessions }) => {
  const groupedSessions = sessions.reduce<Record<string, Session[]>>(
    (acc, session) => {
      const date = dayjs(session.start_time).format("YYYY-MM-DD");
      if (!acc[date]) acc[date] = [];
      acc[date].push(session);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-4">
      {Object.entries(groupedSessions).map(([date, daySessions]) => (
        <div key={date} className="p-4 bg-input rounded shadow">
          <h3 className="font-bold">{dayjs(date).format("DD/MM/YYYY")}</h3>
          <ul>
            {daySessions.map((session) => (
              <li key={session.id} className="flex justify-between">
                <span>
                  De: {dayjs(session.start_time).format("HH:mm")} Até:{" "}
                  {session.end_time
                    ? dayjs(session.end_time).format("HH:mm")
                    : "Ativo"}
                </span>
                <span>Duração: {session.duration || "N/A"}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
