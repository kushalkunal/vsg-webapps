import { useQuery } from "@tanstack/react-query";
import { collegeService } from "@/services/collegeService";
import type { College } from "@/services/collegeService";

export function useColleges(): College[] {
  const { data = [] } = useQuery({
    queryKey: ["public-colleges"],
    queryFn: collegeService.list,
    staleTime: 60_000,
  });
  return data;
}

export type { College };
