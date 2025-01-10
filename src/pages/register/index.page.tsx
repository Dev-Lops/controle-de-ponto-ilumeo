import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserService } from "@/services/userServices";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
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
      await userService.createUser(data);
      toast.success("Usuário cadastrado com sucesso!", { autoClose: 3000 });
      reset();
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.status === 409
            ? "Já existe um usuário com este código."
            : "Erro ao cadastrar usuário.",
          { autoClose: 3000 }
        );
      } else {
        console.error("Erro inesperado:", error);
        toast.error("Erro inesperado ao cadastrar usuário.", {
          autoClose: 3000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NextSeo title={`Cadastrar usuário`} />

      <div className="flex flex-col items-center justify-center h-screen px-4">
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className="max-w-md w-full bg-input shadow-md rounded px-8 py-6">
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
                className={`mt-1 block w-full px-3 py-2 border-gray-600 bg-transparent rounded-md shadow-sm focus:border-orange-500 focus:ring-0 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
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
                placeholder="ABCD1234"
                id="code_name"
                {...register("code_name")}
                className={`mt-1 block w-full px-3 py-2 border-gray-600 bg-transparent rounded-md shadow-sm focus:border-orange-500 focus:ring-0 ${
                  errors.code_name ? "border-red-500" : "border-gray-300"
                }`}
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
              className={`w-full py-2 px-4 text-white rounded-md ${loading ? <div className="spinner"></div> : "text"}`}
            />
          </form>
        </div>
      </div>
    </>
  );
}
