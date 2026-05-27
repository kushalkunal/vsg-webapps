import api, { tenantPath } from "./api";

export interface College {
  id: string;
  name: string;
  country: string;
  city?: string;
  state?: string;
  affiliation?: string;
  ranking?: number;
  description?: string;
  nmcApproved?: boolean;
  whoApproved?: boolean;
  hostelAvailable?: boolean;
  ugcApproved?: boolean;
  aicteApproved?: boolean;
  naacAccredited?: boolean;
  brochureUrl?: string;
  imageUrl?: string;
}

export interface CollegeSearchParams {
  course?: string;
  budget?: number;
  country?: string;
}

export interface AdmissionSearchParams {
  course?: string;
  branch?: string;
  city?: string;
  country?: string;
}

export interface FeeSummary {
  id: string;
  courseName?: string;
  branch?: string;
  registrationFee: number;
  tuitionFee: number;
  examinationFee: number;
  hostelFee: number;
  totalPkgWithoutHostel: number;
  totalPkgWithHostel: number;
  miscellaneousFee: number;
  totalFee: number;
  currency?: string;
}

export interface CollegeWithFees extends College {
  fees: FeeSummary[];
}

export const collegeService = {
  list: () => api.get<College[]>(tenantPath("/colleges")).then((r) => r.data),
  get: (id: string) =>
    api.get<College>(tenantPath(`/colleges/${id}`)).then((r) => r.data),
  create: (payload: Omit<College, "id">) =>
    api.post<College>(tenantPath("/colleges"), payload).then((r) => r.data),
  update: (id: string, payload: Partial<College>) =>
    api.put<College>(tenantPath(`/colleges/${id}`), payload).then((r) => r.data),
  remove: (id: string) =>
    api.delete<void>(tenantPath(`/colleges/${id}`)).then((r) => r.data),
  search: (params: CollegeSearchParams) =>
    api.get<College[]>(tenantPath("/colleges/search"), { params }).then((r) => r.data),
  searchWithFees: (params: AdmissionSearchParams) =>
    api.get<CollegeWithFees[]>(tenantPath("/colleges/with-fees"), { params }).then((r) => r.data),
};
