import React, { type ReactNode } from "react";

interface ButtonProps {
  isClockRunning?: boolean; // Propriedade opcional para controlar o texto dinamicamente
  text?: ReactNode; // Opcional se isClockRunning for usado
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  onClick?: () => void; // Função opcional para clique
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  isClockRunning,
  text,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}) => {
  const buttonText = isClockRunning
    ? "Hora de saída" // Texto quando o relógio está rodando
    : text || "Hora de entrada"; // Texto padrão ou fornecido

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick} // Passa o onClick recebido
      className={`px-4 py-4 rounded font-bold transition ${
        disabled
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-orange-500 hover:bg-orange-600 text-black"
      } ${className}`}
    >
      {buttonText}
    </button>
  );
};
