import React from "react";
import dayjs from "dayjs";
import { Session } from "@/services/sessionService";

interface SessionsByDayProps {
  sessions: Session[];
}

export function SessionsByDay({ sessions }: SessionsByDayProps) {
  // Agrupa as sessões por dia
  const groupedSessions = sessions.reduce(
    (acc: Record<string, Session[]>, session) => {
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
        <div
          key={date}
          className="border bg-input p-4 border-none rounded  shadow-sm"
        >
          <h2 className="text-lg font-bold mb-2">
            {dayjs(date).format("DD/MM/YYYY")}
          </h2>
          <ul className="space-y-2">
            {daySessions.map((session) => (
              <li
                key={session.id}
                className="flex justify-between  p-2 rounded"
              >
                <span>
                  De: {dayjs(session.start_time).format("HH:mm")} - Até:{" "}
                  {session.end_time
                    ? dayjs(session.end_time).format("HH:mm")
                    : "Ativo"}
                </span>
                <span>Horas: {session.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
