import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { useTimer } from "@/hooks/userTime";
import { NextSeo } from "next-seo";
import { Skeleton } from "@/components/skeleton";
import { UserChart } from "@/components/userCharts";
import { SessionsByDay } from "@/components/sessionsByDay";
import { FiArrowLeftCircle } from "react-icons/fi";

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
      <div className="flex flex-col w-[365px] m-auto items-center justify-center h-screen">
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

      <div className="flex flex-col w-[365px] lg:w-[1024px] items-center justify-between pt-20 m-auto">
        <header className="flex justify-between mb-6 w-full items-center">
          {loading ? (
            <>
              <Skeleton width="50px" height="32px" />
              <Skeleton width="100px" height="16px" />
              <div className="flex flex-col items-center">
                <Skeleton width="80px" height="16px" />
                <Skeleton width="60px" height="16px" />
              </div>
            </>
          ) : (
            <>
              <ButtonComponent
                onClick={() => router.push("/")}
                text={<FiArrowLeftCircle size={32} />}
                className="bg-transparent text-orange-400 hover:bg-transparent hover:text-orange-600"
              />
              <h1 className="text-sm font-semibold">Relógio de ponto</h1>
              <div className="flex flex-col items-center text-xs">
                <p className="font-bold">#{user.code_name}</p>
                <p>{user.name}</p>
              </div>
            </>
          )}
        </header>

        <div className="flex flex-col items-start w-full pb-4">
          {loading ? (
            <>
              <Skeleton width="50%" height="2rem" className="mb-2" />
              <Skeleton width="80%" height="1.5rem" />
            </>
          ) : (
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">{currentTime}</p>
              {isClockRunning && (
                <span className="w-3 h-3 bg-lime-300 rounded-full animate-pulse"></span>
              )}
            </div>
          )}
          <p className="text-xs pb-2">Horas de hoje</p>
          <div className="flex w-full text-sm justify-between mb-3">
            <p>Horas totais</p>
            <span className="text-orange-400">{totalDuration}</span>
          </div>
          <ButtonComponent
            text={isClockRunning ? "Hora de saída" : "Hora de entrada"}
            onClick={toggleClock}
            loading={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-black"
          />
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
          {/* Gráfico */}
          <div className="col-span-1">
            {loading ? (
              <Skeleton width="100%" height="200px" />
            ) : (
              <UserChart
                sessions={sessions.map((session) => ({
                  start_time: session.start_time,
                  duration: session.duration || "0h 0m",
                }))}
              />
            )}
          </div>

          {/* Lista de Sessões por Dia */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Dias Anteriores</h3>
            {loading ? (
              Array.from({ length: 1 }).map((_, index) => (
                <Skeleton key={index} width="100%" height="5rem" />
              ))
            ) : (
              <SessionsByDay sessions={sessions} />
            )}
          </div>
        </div>
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
