import api, { tenantPath } from "./api";

export interface Course {
  id: string;
  name: string;
  description?: string;
  durationYears?: number;
}

export const courseService = {
  list: () => api.get<Course[]>(tenantPath("/courses")).then((r) => r.data),
  get: (id: string) =>
    api.get<Course>(tenantPath(`/courses/${id}`)).then((r) => r.data),
  create: (p: Omit<Course, "id">) =>
    api.post<Course>(tenantPath("/courses"), p).then((r) => r.data),
  update: (id: string, p: Partial<Course>) =>
    api.put<Course>(tenantPath(`/courses/${id}`), p).then((r) => r.data),
  remove: (id: string) =>
    api.delete<void>(tenantPath(`/courses/${id}`)).then((r) => r.data),
};
