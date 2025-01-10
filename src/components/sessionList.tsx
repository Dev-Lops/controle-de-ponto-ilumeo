// components/SessionsList.tsx
import React from "react";

interface User {
  id: string;
  name: string;
}

interface WorkSession {
  id: string;
  start_time: string; // já serializada
  end_time: string | null; // já serializada
  user_id: string;
  user?: User;
}

interface SessionsListProps {
  sessions: WorkSession[];
}

export function SessionsList({ sessions }: SessionsListProps) {
  if (!sessions || sessions.length === 0) {
    return <p>Nenhuma sessão encontrada.</p>;
  }

  return (
    <ul className="w-full max-w-md space-y-2">
      {sessions.map((session) => (
        <li
          key={session.id}
          className="p-4 border border-gray-300 rounded bg-white shadow"
        >
          <p>
            <strong>ID:</strong> {session.id}
          </p>
          <p>
            <strong>Início:</strong> {session.start_time}
          </p>
          <p>
            <strong>Fim:</strong> {session.end_time ?? "Em aberto"}
          </p>
          <p>
            <strong>User ID:</strong> {session.user_id}
          </p>
          {session.user && (
            <p>
              <strong>Usuário:</strong> {session.user.name}
            </p>
          )}
        </li>
      ))}
    </ul>
  );
}
