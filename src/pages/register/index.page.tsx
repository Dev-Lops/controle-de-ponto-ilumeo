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
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

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
      }, 3000);
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
        <div className="max-w-md w-full bg-gray-100 shadow-md rounded px-8 py-6">
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Cadastrar Usuário
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                {...register("name")}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

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
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.code_name ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm`}
              />
              {errors.code_name && (
                <p className="text-red-500 text-sm">
                  {errors.code_name.message}
                </p>
              )}
            </div>

            <ButtonComponent
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
