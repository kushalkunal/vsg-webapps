import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  collegeService,
  type College,
  type CollegeSearchParams,
} from "@/services/collegeService";

export const COLLEGES_ADMIN_KEY = "colleges-admin";

export function useCollegeAdmin() {
  return useQuery({
    queryKey: [COLLEGES_ADMIN_KEY],
    queryFn: () => collegeService.list(),
  });
}

export function useCollegeAdminById(id: string) {
  return useQuery({
    queryKey: [COLLEGES_ADMIN_KEY, id],
    queryFn: () => collegeService.get(id),
    enabled: !!id,
  });
}

export function useCollegeSearch(params: CollegeSearchParams) {
  return useQuery({
    queryKey: [COLLEGES_ADMIN_KEY, "search", params],
    queryFn: () => collegeService.search(params),
    enabled: !!(params.course || params.country || params.budget),
  });
}

export function useCreateCollege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<College, "id">) => collegeService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COLLEGES_ADMIN_KEY] });
      toast.success("College added successfully");
    },
  });
}

export function useUpdateCollege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<College> }) =>
      collegeService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [COLLEGES_ADMIN_KEY] });
      qc.invalidateQueries({ queryKey: [COLLEGES_ADMIN_KEY, id] });
      toast.success("College updated successfully");
    },
  });
}

export function useDeleteCollege() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collegeService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COLLEGES_ADMIN_KEY] });
      toast.success("College deleted");
    },
  });
}
