import api, { tenantPath } from "./api";

export interface Student {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  interestedCourse?: string;
  preferredCountry?: string;
  budget?: number;
  neetScore?: number;
  status?: string;
  notes?: string;
  assignedCounsellor?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StudentQuery {
  search?: string;
  status?: string;
  country?: string;
  course?: string;
  page?: number;
  size?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export const studentService = {
  list: (params: StudentQuery = {}) =>
    api.get<Page<Student>>(tenantPath("/students"), { params }).then((r) => r.data),
  get: (id: string) =>
    api.get<Student>(tenantPath(`/students/${id}`)).then((r) => r.data),
  create: (payload: Omit<Student, "id">) =>
    api.post<Student>(tenantPath("/students"), payload).then((r) => r.data),
  update: (id: string, payload: Partial<Student>) =>
    api.put<Student>(tenantPath(`/students/${id}`), payload).then((r) => r.data),
  remove: (id: string) =>
    api.delete<void>(tenantPath(`/students/${id}`)).then((r) => r.data),
};
