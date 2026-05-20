import { useQuery } from "@tanstack/react-query";
import {
  collegeService,
  type AdmissionSearchParams,
} from "@/services/collegeService";

export const ADMISSION_SEARCH_KEY = "admission-search";

export function useAdmissionSearch(params: AdmissionSearchParams) {
  return useQuery({
    queryKey: [ADMISSION_SEARCH_KEY, params],
    queryFn: () => collegeService.searchWithFees(params),
    enabled: !!(params.course || params.country || params.city),
  });
}
