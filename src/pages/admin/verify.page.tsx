import React, { useState } from "react";
import { useRouter } from "next/router";
import { ButtonComponent } from "@/components/button";
import { NextSeo } from "next-seo";

export default function VerifyAdmin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD; // Coloque a senha no .env.local

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === adminPassword) {
      router.push("/register"); // Redireciona para a página de cadastro
    } else {
      setError("Senha incorreta. Tente novamente.");
    }
  };

  return (
    <>
      <NextSeo title={`Autenticação`} />
      <div className="flex flex-col w-[365px] mx-auto items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4 text-orange-500 text-center">
          Autentique-se
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center ">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite a senha de admin"
            className="mb-4 px-4 py-2 w-full border border-orange-500 rounded bg-transparent focus:ring-0 focus:border-orange-700 
          
          "
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <div>
            <ButtonComponent
              text="Autenticar"
              disabled={!password}
              type="submit"
              className="px-3 py-1 text-white rounded text-md"
            />
          </div>
        </form>
      </div>
    </>
  );
}
