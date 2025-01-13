import React from "react";
import { GetServerSideProps } from "next";
import { prisma } from "@/lib/prisma";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { useTimer } from "@/hooks/userTime";
import { NextSeo } from "next-seo";
import { Skeleton } from "@/components/skeleton";
import { SessionsByDay } from "@/components/sessionsByDays";
import { FiArrowLeftCircle } from "react-icons/fi";

interface UserPageProps {
  user: {
    id: string;
    name: string;
    code_name: string;
    createdAt: string;
  } | null;
}

const UserPage: React.FC<UserPageProps> = ({ user }) => {
  const router = useRouter();

  const {
    isClockRunning,
    currentTime,
    totalDuration,
    sessions,
    toggleClock,
    loading,
  } = useTimer(user?.code_name || "");

  if (!user) {
    return <UserNotFound onReturn={() => router.push("/")} />;
  }

  return (
    <>
      <NextSeo title={`Ponto - ${user.name}`} />
      <div className="flex flex-col w-[365px] lg:w-[450px] items-center justify-between pt-20 m-auto">
        <Header
          user={user}
          loading={loading}
          onReturn={() => router.push("/")}
        />
        <TimerSection
          loading={loading}
          isClockRunning={isClockRunning}
          currentTime={currentTime}
          totalDuration={totalDuration}
          onToggleClock={toggleClock}
        />
        <Dashboard sessions={sessions} loading={loading} />
      </div>
    </>
  );
};

const UserNotFound: React.FC<{ onReturn: () => void }> = ({ onReturn }) => (
  <div className="flex flex-col w-[450] h-screen items-center justify-center">
    <p className="text-lg text-red-500 mb-4">Usuário não encontrado.</p>
    <ButtonComponent
      label="Retornar à Home"
      onClick={onReturn}
      className="bg-orange-500 hover:bg-orange-600 text-black"
    />
  </div>
);

const Header: React.FC<{
  user: { code_name: string; name: string };
  loading: boolean;
  onReturn: () => void;
}> = ({ user, loading, onReturn }) => (
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
          onClick={onReturn}
          label={<FiArrowLeftCircle size={32} />}
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
);

const TimerSection: React.FC<{
  loading: boolean;
  isClockRunning: boolean;
  currentTime: string;
  totalDuration: string;
  onToggleClock: () => void;
}> = (props) => {
  const { loading, isClockRunning, currentTime, totalDuration, onToggleClock } =
    props;
  return (
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
        label={isClockRunning ? "Hora de saída" : "Hora de entrada"}
        onClick={onToggleClock}
        isLoading={loading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-black"
      />
    </div>
  );
};

const Dashboard: React.FC<{ sessions: any[]; loading: boolean }> = ({
  sessions,
  loading,
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 w-full">
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
);

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  const { code } = context.params!;

  if (!code || typeof code !== "string" || code.trim() === "") {
    return {
      props: { user: null },
    };
  }

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

export default UserPage;
