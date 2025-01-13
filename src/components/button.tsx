import React, { type ReactNode } from 'react';

interface ButtonProps {
  isRunning?: boolean; // Define se o relógio está ativo
  isLoading?: boolean; // Indica o estado de carregamento
  label?: ReactNode; // Texto do botão
  type?: 'button' | 'submit' | 'reset'; // Tipo do botão
  isDisabled?: boolean; // Controla o estado desativado
  className?: string; // Classes CSS adicionais
  onClick?: () => void; // Função de clique
}

export const ButtonComponent: React.FC<ButtonProps> = ({
  isRunning = false,
  isLoading = false,
  label = 'Hora de entrada',
  type = 'button',
  isDisabled = false,
  className = '',
  onClick,
}) => {
  const getButtonText = (): ReactNode => {
    if (isLoading) {
      return (
        <span
          className="animate-spin inline-block w-5 h-5 border-4 border-t-transparent border-black rounded-full"
          role="status"
          aria-label="Loading"
        ></span>
      );
    }
    return isRunning ? 'Hora de saída' : label;
  };

  const isButtonDisabled = isDisabled || isLoading;

  const buttonClass = `
    flex items-center justify-center px-4 py-2 rounded font-bold transition text-xl 
    ${isButtonDisabled ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 text-black'} 
    ${className}
  `.trim();

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      onClick={onClick}
      className={buttonClass}
    >
      {getButtonText()}
    </button>
  );
};
