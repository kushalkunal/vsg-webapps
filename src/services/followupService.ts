import api, { tenantPath } from "./api";

export interface Followup {
  id: string;
  studentId: string;
  note: string;
  reminderDate?: string;
  channel?: "call" | "whatsapp" | "email" | "in-person";
  createdBy?: string;
  createdAt?: string;
}

export const followupService = {
  listByStudent: (studentId: string) =>
    api
      .get<Followup[]>(tenantPath(`/followups`), { params: { studentId } })
      .then((r) => r.data),
  create: (p: Omit<Followup, "id" | "createdAt">) =>
    api.post<Followup>(tenantPath("/followups"), p).then((r) => r.data),
  remove: (id: string) =>
    api.delete<void>(tenantPath(`/followups/${id}`)).then((r) => r.data),
};
