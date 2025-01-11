import axios from "axios";

export const TimerStorage = {
  saveStartTime: async (userCode: string, startTime: Date) => {
    try {
      const response = await axios.post("/api/timer", {
        userCode,
        startTime: startTime.toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao salvar startTime:", error);
      throw new Error("Erro ao salvar startTime.");
    }
  },

  getStartTime: async (userCode: string): Promise<Date | null> => {
    try {
      const response = await axios.get("/api/timer", {
        params: { userCode },
      });
      return new Date(response.data.start_time);
    } catch (error) {
      console.error("Erro ao buscar startTime:", error);
      throw new Error("Erro ao buscar startTime.");
    }
  },

  clearStartTime: async (userCode: string) => {
    try {
      await axios.delete(`/api/timer?userCode=${userCode}`);
    } catch (error) {
      console.error("Erro ao limpar startTime:", error);
      throw new Error("Erro ao limpar startTime.");
    }
  },
};
