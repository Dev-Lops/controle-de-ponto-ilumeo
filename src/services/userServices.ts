import { api } from "@/lib/axios";

export interface CreateUserInput {
  name: string;
  code_name: string;
}

export class UserService {
  private readonly USER_ENDPOINT = "/users";

  /**
   * Cria um novo usuário.
   * @param data - Dados do usuário a ser criado.
   * @returns Dados do usuário criado.
   */
  async createUser(data: CreateUserInput): Promise<any> {
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

  /**
   * Verifica se um usuário com o código especificado já existe.
   * @param code_name - Código do usuário.
   * @returns Verdadeiro se o usuário existir, falso caso contrário.
   */
  async checkUserExists(code_name: string): Promise<boolean> {
    try {
      const response = await api.get("/users", { params: { code_name } });
      return response.data.exists;
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      throw new Error("Erro ao verificar usuário.");
    }
  }

  /**
   * Trata erros da API.
   * @param error - Objeto de erro capturado.
   * @param defaultMessage - Mensagem padrão de erro.
   * @param specificStatus - Status HTTP específico a tratar (opcional).
   * @param specificMessage - Mensagem de erro específica para o status (opcional).
   */
  private handleError(
    error: unknown,
    defaultMessage: string,
    specificStatus?: number,
    specificMessage?: string
  ): never {
    if (error instanceof Error && "response" in error) {
      const axiosError = error as any;
      const status = axiosError.response?.status;

      if (specificStatus && status === specificStatus) {
        throw new Error(specificMessage);
      }

      throw new Error(axiosError.response?.data?.message || defaultMessage);
    }

    console.error(defaultMessage, error);
    throw new Error(defaultMessage);
  }
}
