import React, { type ReactNode } from "react";

interface ButtonProps {
  isClockRunning?: boolean; // Controla o texto dinamicamente com base no estado do relógio
  loading?: boolean; // Indica o estado de carregamento
  text?: ReactNode; // Texto do botão
  type?: "button" | "submit" | "reset"; // Tipo do botão
  disabled?: boolean; // Desabilita o botão
  className?: string; // Classes CSS adicionais
  onClick?: () => void; // Função chamada ao clicar no botão
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  isClockRunning = false,
  loading = false, // Estado de carregamento padrão
  text = "Hora de entrada", // Texto padrão
  type = "button",
  disabled = false,
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading} // Desabilita o botão durante o carregamento
      onClick={onClick}
      className={`flex items-center justify-center px-2 py-2 rounded font-bold transition text-xl ${
        disabled || loading
          ? "bg-transparent cursor-not-allowed text-gray-600"
          : "bg-orange-500 hover:bg-orange-600 text-black"
      } ${className}`}
    >
      {loading ? (
        <span
          className="animate-spin inline-block w-5 h-5 border-4 border-t-transparent border-black rounded-full"
          role="status"
          aria-label="Loading"
        ></span>
      ) : isClockRunning ? (
        "Hora de saída"
      ) : (
        text
      )}
    </button>
  );
};
