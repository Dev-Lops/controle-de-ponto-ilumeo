import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserService } from '@/services/userServices';
import { useRouter } from 'next/router';
import { ButtonComponent } from '@/components/button';
import { toast, ToastContainer } from 'react-toastify';
import { userSchema } from '@/validations/userValidations';

import { NextSeo } from 'next-seo';
import { FiArrowLeftCircle } from 'react-icons/fi';
import { InputField } from '@/components/inputField';

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

  const handleCodeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 8);
    setValue('code_name', value, { shouldValidate: true });
  };

  const onSubmit = async (data: UserFormData) => {
    setLoading(true);
    try {
      const exists = await userService.checkUserExists(data.code_name);
      if (exists) {
        toast.error('Já existe um usuário com este código.');
        return;
      }
      await userService.createUser(data);
      toast.success('Usuário cadastrado com sucesso!');
      reset();
      setTimeout(() => router.push('/'), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Erro inesperado.');
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
            onClick={() => router.push('/')}
            label={<FiArrowLeftCircle size={32} />}
            className="bg-transparent text-orange-400 hover:bg-transparent hover:text-orange-600"
          />
          <h1 className="text-2xl font-bold text-center mb-6 text-orange-500">
            Cadastrar Usuário
          </h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nome */}
            <InputField<UserFormData>
              id="name"
              label="Nome"
              name="name"
              placeholder="John Doe"
              register={register}
              errorMessage={errors.name?.message}
            />
            <InputField<UserFormData>
              id="code_name"
              label="Código"
              name="code_name"
              placeholder="ex: ABCD1234"
              register={register}
              errorMessage={errors.code_name?.message}
              maxLength={8}
              onChange={handleCodeNameChange}
            />

            {/* Botão de Cadastro */}
            <ButtonComponent
              isLoading={loading}
              label="Cadastrar"
              type="submit"
              isDisabled={loading}
              className="w-full py-2 px-4 text-white bg-orange-500 rounded-md"
            />
          </form>
        </div>
      </div>
    </>
  );
}
