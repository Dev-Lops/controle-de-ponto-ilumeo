import React, { type ReactNode } from "react";

interface ButtonProps {
  isClockRunning?: boolean; // Controla o texto dinamicamente com base no estado do relógio
  text?: ReactNode; // Texto do botão, opcional se `isClockRunning` for usado
  type?: "button" | "submit" | "reset"; // Tipo do botão, padrão: "button"
  disabled?: boolean; // Desabilita o botão
  className?: string; // Classes CSS adicionais
  onClick?: () => void; // Função chamada ao clicar no botão
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  isClockRunning = false,
  text = "Hora de entrada", // Texto padrão
  type = "button",
  disabled = false,
  className = "",
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-4 rounded font-bold transition text-xl ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-black"
      } ${className}`}
    >
      {isClockRunning ? "Hora de saída" : text}
    </button>
  );
};
