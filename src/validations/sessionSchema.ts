import { z } from "zod";

export const sessionSchema = z.object({
  codeName: z.string().nonempty("Code Name é obrigatório"),
  startTime: z.string().nonempty("Start Time é obrigatório"),
  endTime: z.string().nonempty("End Time é obrigatório"),
});
