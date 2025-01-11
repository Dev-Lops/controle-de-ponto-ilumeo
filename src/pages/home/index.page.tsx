import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/Button";
import { userCodeSchema } from "@/validations/userValidations";
import { NextSeo } from "next-seo";
import { FiPlus } from "react-icons/fi";

// Define a tipagem do formulário com base no schema do Zod
type FormData = z.infer<typeof userCodeSchema>;

export default function Home() {
  const [loading, setLoading] = useState(false); // Controla o estado de loading
  const router = useRouter();

  // Configuração do formulário com validação do Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userCodeSchema),
    mode: "onChange", // Validação em tempo real
  });

  // Atualizar o valor do input para letras maiúsculas e limitar a 8 caracteres
  const handleCodeUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8); // Garante maiúsculas e no máximo 8 caracteres
    setValue("codeUser", value, { shouldValidate: true });
  };

  // Lidar com o envio do formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true); // Ativa o estado de loading
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula carregamento
      router.push(`/users/${data.codeUser}`);
    } finally {
      setLoading(false); // Desativa o estado de loading
    }
  };

  function handleNewUser() {
    router.push(`/admin/verify`);
  }

  return (
    <>
      <NextSeo
        title="Página Inicial - Controle de Ponto"
        description="Gerencie suas horas de trabalho com a aplicação Controle de Ponto Ilumeo."
        openGraph={{
          title: "Home - Controle de Ponto",
          description:
            "Gerencie suas horas de trabalho com a aplicação Controle de Ponto Ilumeo.",
          url: "https://controle-de-ponto-ilumeo.vercel.app",
          images: [
            {
              url: "https://controle-de-ponto-ilumeo.vercel.app/favicon.svg",
              width: 500,
              height: 500,
              alt: "Página Inicial do Controle de Ponto",
            },
          ],
        }}
      />
      <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-6 bg-background text-foreground">
        <div className="flex flex-col w-full max-w-sm">
          {/* Cabeçalho */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-start font-light ">
              Ponto <span className="font-bold">Ilumeo</span>
            </h1>

            <ButtonComponent
              onClick={handleNewUser}
              text={<FiPlus size={32} />}
              className="bg-transparent text-orange-400 hover:bg-transparent hover:rotate-90"
            />
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {/* Campo de entrada */}
            <div className="bg-input shadow-md rounded-lg p-4">
              <label
                htmlFor="codeUser"
                className="text-xs font-medium block mb-1"
              >
                Código do Usuário
              </label>
              <input
                type="text"
                id="codeUser"
                {...register("codeUser")}
                onChange={handleCodeUserChange}
                placeholder="Digite o código"
                required
                maxLength={8} // Limita o input a 8 caracteres
                aria-label="Código do usuário"
                aria-describedby="codeUserHelp"
                className={`w-full text-xl border-none bg-transparent rounded outline-none focus:outline-none transition-all duration-200 ${
                  errors.codeUser
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                }`}
              />
              {errors.codeUser && (
                <span
                  id="codeUserHelp"
                  className="text-red-500 text-xs mt-1 block"
                >
                  {errors.codeUser.message}
                </span>
              )}
            </div>

            {/* Botão de envio */}
            <ButtonComponent
              text={loading ? null : "Acessar"}
              type="submit"
              disabled={loading}
              loading={loading} // Estado de loading
              className="mt-4 bg-orange-500"
            />
          </form>
        </div>
      </div>
    </>
  );
}
