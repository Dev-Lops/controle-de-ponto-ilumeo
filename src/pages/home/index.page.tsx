// pages/index.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { userCodeSchema } from "@/validations/userValidations";

// Tipagem para o formulário
type FormData = z.infer<typeof userCodeSchema>;

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(userCodeSchema),
    mode: "onChange", // Validação em tempo real
  });

  // Atualizar o valor do input para letras maiúsculas
  const handleCodeUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setValue("codeUser", value);
  };

  // Enviar formulário
  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula carregamento
      router.push(`/users/${data.codeUser}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 sm:px-6 bg-background text-foreground">
      <div className="flex flex-col w-full max-w-sm">
        <h1 className="text-3xl text-start font-light mb-8">
          Ponto <span className="font-bold">Ilumeo</span>
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="bg-input shadow-md rounded-lg p-2">
            <label htmlFor="codeUser" className="text-xs font-medium ml-4">
              Código do Usuário
            </label>
            <input
              type="text"
              id="codeUser"
              {...register("codeUser")}
              onChange={handleCodeUserChange}
              placeholder="Digite o código"
              required
              aria-label="Código do usuário"
              aria-describedby="codeUserHelp"
              className={`w-full text-2xl border-none bg-transparent rounded transition duration-200 ${
                errors.codeUser
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              }`}
            />
            {errors.codeUser && (
              <span id="codeUserHelp" className="text-red-500 text-sm">
                {errors.codeUser.message}
              </span>
            )}
          </div>

          <ButtonComponent
            text={loading ? "Carregando..." : "Confirmar"}
            type="submit"
            disabled={loading}
            className={`mt-4 ${loading ? "cursor-not-allowed opacity-50" : ""}`}
          />
        </form>
      </div>
    </div>
  );
}
