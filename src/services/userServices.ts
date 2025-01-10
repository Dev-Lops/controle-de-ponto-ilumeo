import { api } from "@/lib/axios";

export class UserService {
  async fetchUser(codeName: string) {
    const response = await api.get(`/users/${codeName}`);
    return response.data;
  }
}
