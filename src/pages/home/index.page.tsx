import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Definindo o esquema de validação com Zod
const schema = z.object({
  codeUser: z
    .string()
    .min(1, { message: "O código do usuário é obrigatório" })
    .regex(/^[a-zA-Z0-9]+$/, {
      message: "O código deve conter apenas letras e números",
    }),
});

// Tipagem para o formulário
type FormData = {
  codeUser: string;
};

export default function Home() {
  // Configuração do React Hook Form com Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Para manipular o valor do campo manualmente
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // Função para manipular o evento onChange e garantir que as letras sejam maiúsculas
  const handleCodeUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // Converte o valor para maiúsculas
    setValue("codeUser", value); // Atualiza o valor no React Hook Form
  };

  // Função para submissão do formulário
  const onSubmit = (data: FormData) => {
    console.log("Formulário enviado:", data);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col w-[365px]">
        <h1 className="text-2xl text-start font-light mb-11">
          Ponto <span className="font-bold">Ilumeo</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col pt-2 ">
          <div className="bg-input rounded-md">
            <label
              htmlFor="codeUser"
              className="text-xs align-center mb-1 ml-4"
            >
              Código do usuário
            </label>
            <input
              type="text"
              id="codeUser"
              {...register("codeUser")}
              onChange={handleCodeUserChange} // Manipula a entrada para garantir maiúsculas
              required
              className="w-full p-3 border-none bg-transparent rounded transition duration-200 ease-in-out focus:outline-none focus:ring-0"
              placeholder="Digite um código"
            />
            {/* Exibindo erro de validação */}
            {errors.codeUser && (
              <span className="text-red-500 text-sm ml-4">
                {errors.codeUser.message}
              </span>
            )}
          </div>
          <button className="px-6 py-3 mt-6 font-semibold text-black bg-button rounded hover:bg-button">
            Iniciar Turno
          </button>
        </form>
      </div>
    </div>
  );
}
