import api from "./api";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  tenantId: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password: string;
  roles: string[];
}

export const userService = {
  async list(): Promise<AppUser[]> {
    const { data } = await api.get<AppUser[]>("/admin/users");
    return data;
  },

  async create(payload: CreateUserPayload): Promise<AppUser> {
    const { data } = await api.post<AppUser>("/admin/users", payload);
    return data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  },

  async enable(id: string): Promise<void> {
    await api.patch(`/admin/users/${id}/enable`);
  },

  async disable(id: string): Promise<void> {
    await api.patch(`/admin/users/${id}/disable`);
  },
};
