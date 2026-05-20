import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  followupService,
  type Followup,
} from "@/services/followupService";

export const FOLLOWUPS_KEY = "followups";

export function useFollowups(studentId?: string) {
  return useQuery({
    queryKey: [FOLLOWUPS_KEY, studentId],
    queryFn: () => followupService.listByStudent(studentId ?? ""),
    enabled: !!studentId,
  });
}

export function useAllFollowups() {
  return useQuery({
    queryKey: [FOLLOWUPS_KEY, "all"],
    queryFn: () => followupService.listByStudent(""),
  });
}

export function useCreateFollowup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Followup, "id" | "createdAt">) =>
      followupService.create(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY, vars.studentId] });
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY, "all"] });
      toast.success("Follow-up added");
    },
  });
}

export function useDeleteFollowup() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => followupService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FOLLOWUPS_KEY] });
      toast.success("Follow-up removed");
    },
  });
}
