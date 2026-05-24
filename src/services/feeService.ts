import api, { tenantPath } from "./api";

export interface Fee {
  id: string;
  collegeId?: string;
  courseId?: string;
  branch?: string;
  collegeName?: string;
  courseName?: string;
  tuitionFee: number;
  hostelFee: number;
  visaFee: number;
  insuranceFee: number;
  miscellaneousFee: number;
  totalFee: number;
  currency?: string;
}

export const feeService = {
  list: () => api.get<Fee[]>(tenantPath("/fees")).then((r) => r.data),
  get: (id: string) =>
    api.get<Fee>(tenantPath(`/fees/${id}`)).then((r) => r.data),
  create: (p: Omit<Fee, "id">) =>
    api.post<Fee>(tenantPath("/fees"), p).then((r) => r.data),
  update: (id: string, p: Partial<Fee>) =>
    api.put<Fee>(tenantPath(`/fees/${id}`), p).then((r) => r.data),
  delete: (id: string) =>
    api.delete(tenantPath(`/fees/${id}`)).then(() => undefined),
};
