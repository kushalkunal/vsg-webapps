import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  studentService,
  type Student,
  type StudentQuery,
} from "@/services/studentService";

export const STUDENTS_KEY = "students";

export function useStudents(params: StudentQuery = {}) {
  return useQuery({
    queryKey: [STUDENTS_KEY, params],
    queryFn: () => studentService.list(params),
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: [STUDENTS_KEY, id],
    queryFn: () => studentService.get(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Student, "id" | "createdAt" | "updatedAt">) =>
      studentService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      toast.success("Student added successfully");
    },
  });
}

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Student> }) =>
      studentService.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      qc.invalidateQueries({ queryKey: [STUDENTS_KEY, id] });
      toast.success("Student updated successfully");
    },
  });
}

export function useDeleteStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => studentService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [STUDENTS_KEY] });
      toast.success("Student deleted");
    },
  });
}
