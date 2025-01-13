import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonComponent } from '@/components/button';
import { NextSeo } from 'next-seo';

/**
 * Componente para autenticação de administrador.
 */
const VerifyAdmin: React.FC = () => {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Obtém a senha do administrador do arquivo .env
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

  /**
   * Valida a senha e redireciona para a página de registro se correta.
   * @param e Evento de envio do formulário
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password === adminPassword) {
      router.push('/register');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  return (
    <>
      <NextSeo title="Autenticação" />
      <div className="flex flex-col w-[365px] mx-auto items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4 text-orange-500 text-center">
          Autentique-se
        </h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center w-full"
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha de admin"
            className="mb-4 px-4 py-2 w-full border border-orange-500 rounded bg-transparent focus:ring-0 focus:border-orange-700"
            aria-label="Senha de administrador"
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <ButtonComponent
            label="Autenticar"
            isDisabled={!password}
            type="submit"
            className="px-4 py-2 rounded text-md bg-orange-500 hover:bg-orange-600 text-white"
          />
        </form>
      </div>
    </>
  );
};

export default VerifyAdmin;
