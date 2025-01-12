import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "@/services/userServices";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userSchema } from "@/validations/userValidations";
import { NextSeo } from "next-seo";
import { FiArrowLeftCircle } from "react-icons/fi";

type UserFormData = z.infer<typeof userSchema>;

const userService = new UserService();

export default function RegisterUser() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  // Função para forçar letras maiúsculas e limitar a 8 caracteres
  const handleCodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setValue("code_name", value, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      const exists = await userService.checkUserExists(data.code_name);
      if (exists) {
        toast.error("Já existe um usuário com este código.");
        return;
      }

      await userService.createUser(data);
      toast.success("Usuário cadastrado com sucesso!");
      reset();
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message || "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title="Cadastrar Usuário" />
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className="max-w-md w-full bg-input shadow-md rounded px-8 py-6">
          <ButtonComponent
            onClick={() => router.push("/")}
            text={<FiArrowLeftCircle size={32} />}
            className="bg-transparent text-orange-400 hover:bg-transparent hover:text-orange-600"
          />
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Cadastrar Usuário
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-orange-500"
              >
                Nome
              </label>
              <input
                type="text"
                id="name"
                placeholder="John Doe"
                {...register("name")}
                className={`mt-1 block w-full bg-transparent border-orange-400 px-3 py-2 border focus:ring-0 focus:border-orange-700  ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            {/* Campo Código */}
            <div>
              <label
                htmlFor="code_name"
                className="block text-sm font-medium text-orange-500"
              >
                Código
              </label>
              <input
                type="text"
                id="code_name"
                {...register("code_name")}
                onChange={handleCodeNameChange}
                placeholder="ex: ABCD1234"
                maxLength={8} // Limita o campo a 8 caracteres
                className={`mt-1 block bg-transparent w-full border-orange-400 px-3 py-2 border focus:ring-0 focus:border-orange-700  ${
                  errors.code_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.code_name && (
                <p className="text-red-500 text-sm">
                  {errors.code_name.message}
                </p>
              )}
            </div>

            {/* Botão de Cadastro */}
            <ButtonComponent
              loading={loading} // Passa o estado de carregamento
              text="Cadastrar"
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-white bg-orange-500 rounded-md"
            />
          </form>
        </div>
      </div>
    </>
  );
}
