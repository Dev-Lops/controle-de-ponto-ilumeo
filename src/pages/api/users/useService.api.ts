// src/services/userService.ts
import { api } from "@/lib/axios";

interface User {
  id: string;
  name: string;
  code_name: string;
  createdAt: string;
}

export class UserService {
  /**
   * Obtém a lista de usuários.
   * @returns Uma lista de usuários do sistema.
   */
  async getUsers(): Promise<User[]> {
    const response = await api.get<User[]>("/users");
    return response.data;
  }

  /**
   * Cria um novo usuário no sistema.
   * @param name Nome do usuário.
   * @param code Código identificador único do usuário.
   * @returns O usuário criado.
   */
  async createUser(name: string, code: string): Promise<User> {
    const response = await api.post<User>("/users", { name, code });
    return response.data;
  }
}
