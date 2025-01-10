import { api } from "@/lib/axios";

export interface CreateUserInput {
  name: string;
  code_name: string;
}

export class UserService {
  // Busca um usuário pelo codeName
  async fetchUser(codeName: string) {
    if (!codeName) throw new Error("O código do usuário é obrigatório.");
    try {
      const response = await api.get(`/users/${codeName}`);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      throw new Error("Não foi possível buscar o usuário.");
    }
  }

  // Cria um novo usuário
  async createUser(data: CreateUserInput) {
    const { name, code_name } = data;
    if (!name || !code_name) {
      throw new Error("Nome e código do usuário são obrigatórios.");
    }

    try {
      const response = await api.post("/users", { name, code_name });
      return response.data;
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw new Error("Não foi possível criar o usuário.");
    }
  }
}
