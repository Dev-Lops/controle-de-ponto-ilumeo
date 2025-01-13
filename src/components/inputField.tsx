import React from 'react';
import { UseFormRegister, FieldValues, Path } from 'react-hook-form';

interface InputFieldProps<T extends FieldValues> {
  id: string;
  label: string;
  name: Path<T>; // Nome do campo baseado no tipo genérico T
  placeholder?: string;
  maxLength?: number;
  errorMessage?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: UseFormRegister<T>; // Tipo correto para o método register
}

export const InputField = <T extends FieldValues>({
  id,
  label,
  name,
  placeholder,
  maxLength,
  errorMessage,
  onChange,
  register,
}: InputFieldProps<T>) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-orange-500 mb-1"
    >
      {label}
    </label>
    <input
      id={id}
      {...register(name)} // Uso correto do método register com Path<T>
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={onChange}
      className={`mt-1 block w-full bg-transparent px-3 py-2 border border-orange-400 focus:ring-0 focus:border-orange-700 rounded-md shadow-sm ${
        errorMessage ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
  </div>
);
