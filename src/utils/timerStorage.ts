import { api } from "@/lib/axios";
import axios from "axios";

export const TimerStorage = {
  saveStartTime: async (userCode: string, startTime: Date) => {
    try {
      await axios.post("/api/timer", {
        userCode,
        startTime: startTime.toISOString(),
      });
      console.log(`Timer salvo para ${userCode} com start_time ${startTime}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao salvar startTime:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            "Erro ao salvar startTime no servidor."
        );
      } else {
        console.error("Erro desconhecido ao salvar startTime:", error);
        throw new Error("Erro desconhecido ao salvar startTime.");
      }
    }
  },

  getStartTime: async (userCode: string): Promise<Date | null> => {
    try {
      const response = await api.get("/timer", {
        params: { userCode },
      });

      if (!response.data?.start_time) {
        console.log(`Timer ainda não iniciado para o código ${userCode}`);
        return null;
      }

      return new Date(response.data.start_time);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao buscar startTime:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            "Erro ao buscar startTime no servidor."
        );
      } else {
        console.error("Erro desconhecido ao buscar startTime:", error);
        throw new Error("Erro desconhecido ao buscar startTime.");
      }
    }
  },

  clearStartTime: async (userCode: string) => {
    try {
      await api.delete(`/timer`, { params: { userCode } });
      console.log(`Timer para ${userCode} foi removido.`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          "Erro ao limpar startTime:",
          error.response?.data || error.message
        );
        throw new Error(
          error.response?.data?.message ||
            "Erro ao limpar startTime no servidor."
        );
      } else {
        console.error("Erro desconhecido ao limpar startTime:", error);
        throw new Error("Erro desconhecido ao limpar startTime.");
      }
    }
  },
};
