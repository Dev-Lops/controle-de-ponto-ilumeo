import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { ArrowCircleLeft } from "@phosphor-icons/react";
import { useTimer } from "@/hooks/userTime";
import { NextSeo } from "next-seo";
import { Skeleton } from "@/components/skeleton"; // Componente Skeleton para fallback de carregamento

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

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-red-500 text-lg mb-4">Usuário não encontrado.</p>
        <ButtonComponent
          text="Retornar à Home"
          onClick={() => router.push("/")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-black"
        />
      </div>
    );
  }

  const {
    isClockRunning,
    currentTime,
    totalDuration,
    sessions,
    toggleClock,
    loading,
  } = useTimer(user.code_name);

  return (
    <>
      <NextSeo title={`Ponto - ${user.name}`} />

      <div className="flex flex-col w-[365px] items-center justify-between pt-20 m-auto">
        <header className="flex justify-between mb-6 w-full items-center">
          <ButtonComponent
            onClick={() => router.push("/")}
            text={<ArrowCircleLeft size={32} />}
            className="bg-transparent text-orange-400 hover:bg-transparent hover:text-orange-600"
          />
          <h1 className="text-sm font-semibold">Relógio de ponto</h1>
          <div className="flex flex-col items-center text-xs">
            <p className="font-bold">#{user.code_name}</p>
            <p>{user.name}</p>
          </div>
        </header>

        <div className="flex flex-col items-start w-full pb-4">
          {loading ? (
            <>
              <Skeleton width="50%" height="2rem" className="mb-2" />
              <Skeleton width="80%" height="1.5rem" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{currentTime}</p>
                {isClockRunning && (
                  <span className="w-3 h-3 bg-lime-300 rounded-full animate-pulse"></span>
                )}
              </div>
              <p className="text-xs pb-2">Horas de hoje</p>
              <div className="flex w-full text-sm justify-between mb-3">
                <p>Horas totais</p>
                <span className="text-orange-400">{totalDuration}</span>
              </div>
              <ButtonComponent
                text={isClockRunning ? "Hora de saída" : "Hora de entrada"}
                onClick={toggleClock}
                className="w-full bg-orange-500 hover:bg-orange-600 text-black"
              />
            </>
          )}
        </div>

        <main className="flex flex-col w-full">
          <h3 className="text-start mb-2 font-semibold">Dias anteriores</h3>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="p-6 bg-input rounded mb-2 animate-pulse"
              />
            ))
          ) : sessions.length > 0 ? (
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
    </>
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
    if (!user) return { props: { user: null } };
    return {
      props: { user: { ...user, createdAt: user.createdAt.toISOString() } },
    };
  } catch (error) {
    console.error("Erro ao buscar o usuário:", error);
    return { props: { user: null } };
  }
};
