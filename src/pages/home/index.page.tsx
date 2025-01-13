import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { userCodeSchema } from "@/validations/userValidations";
import { NextSeo } from "next-seo";
import { FiPlus } from "react-icons/fi";

// Tipagem baseada no schema Zod
type FormData = z.infer<typeof userCodeSchema>;

/**
 * Página Inicial - Home
 */
const Home: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Configuração do formulário com validação via Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userCodeSchema),
    mode: "onChange",
  });

  /**
   * Atualiza o valor do campo do código do usuário, garantindo letras maiúsculas e no máximo 8 caracteres.
   * @param e Evento de mudança no input
   */
  const handleCodeUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setValue("codeUser", value, { shouldValidate: true });
  };

  /**
   * Lida com o envio do formulário, redirecionando o usuário para sua página pessoal.
   * @param data Dados do formulário
   */
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula um carregamento
      router.push(`/users/${data.codeUser}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Redireciona o usuário para a página de verificação de administrador.
   */
  const handleNewUser = () => {
    router.push(`/admin/verify`);
  };

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
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl text-start font-light">
              Ponto <span className="font-bold">Ilumeo</span>
            </h1>
            <ButtonComponent
              onClick={handleNewUser}
              label={<FiPlus size={32} />}
              className="bg-transparent text-orange-400 hover:bg-transparent hover:rotate-90"
            />
          </header>

          {/* Formulário */}
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
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
                maxLength={8}
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

            <ButtonComponent
              label={loading ? null : "Acessar"}
              type="submit"
              isDisabled={loading}
              isLoading={loading}
              className="mt-4 bg-orange-500"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default Home;
