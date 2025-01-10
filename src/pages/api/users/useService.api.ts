// src/services/userService.ts
import { api } from "@/lib/axios";

export async function getUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function createUser(name: string, code: string) {
  const response = await api.post("/users", { name, code });
  return response.data;
}
