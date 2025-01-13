import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private static instance: AxiosInstance;

  private constructor() {
    // Impede a criação de instâncias diretamente
  }

  /**
   * Retorna uma instância única de Axios.
   */
  public static getInstance(): AxiosInstance {
    if (!ApiClient.instance) {
      ApiClient.instance = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      ApiClient.addInterceptors();
    }

    return ApiClient.instance;
  }

  /**
   * Adiciona interceptores para manipular erros ou respostas globais.
   */
  private static addInterceptors() {
    ApiClient.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          console.error(`Erro na API: ${error.response.statusText}`, error);
        } else if (error.request) {
          console.error('Erro na API: Sem resposta do servidor.', error);
        } else {
          console.error('Erro ao configurar a requisição:', error);
        }
        return Promise.reject(error);
      }
    );
  }
}

// Exporta uma instância única para ser reutilizada
export const api = ApiClient.getInstance();
