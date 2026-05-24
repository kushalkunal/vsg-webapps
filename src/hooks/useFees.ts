import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { feeService, type Fee } from "@/services/feeService";

export const FEES_KEY = "fees";

export function useFees() {
  return useQuery({
    queryKey: [FEES_KEY],
    queryFn: () => feeService.list(),
  });
}

export function useFee(id: string) {
  return useQuery({
    queryKey: [FEES_KEY, id],
    queryFn: () => feeService.get(id),
    enabled: !!id,
  });
}

export function useCreateFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Fee, "id">) => feeService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FEES_KEY] });
      toast.success("Fee structure added");
    },
  });
}

export function useUpdateFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Fee> }) =>
      feeService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [FEES_KEY] });
      qc.invalidateQueries({ queryKey: [FEES_KEY, id] });
      toast.success("Fee structure updated");
    },
  });
}

export function useDeleteFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feeService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [FEES_KEY] });
      toast.success("Fee structure deleted");
    },
  });
}
