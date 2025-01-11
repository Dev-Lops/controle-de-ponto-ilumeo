import { api } from "@/lib/axios";

export interface CreateUserInput {
  name: string;
  code_name: string;
}

export class UserService {
  async createUser(data: CreateUserInput) {
    try {
      const response = await api.post("/users", data);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error("Já existe um usuário com este código.");
      }
      throw new Error("Erro ao criar o usuário.");
    }
  }

  async checkUserExists(code_name: string): Promise<boolean> {
    try {
      const response = await api.get("/users", {
        params: { code_name },
      });
      return response.data.exists;
    } catch (error) {
      throw new Error("Erro ao verificar usuário.");
    }
  }
}
