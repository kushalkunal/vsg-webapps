import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { courseService, type Course } from "@/services/courseService";

export const COURSES_ADMIN_KEY = "courses-admin";

export function useCourseAdmin() {
  return useQuery({
    queryKey: [COURSES_ADMIN_KEY],
    queryFn: () => courseService.list(),
  });
}

export function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Course, "id">) => courseService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COURSES_ADMIN_KEY] });
      toast.success("Course added");
    },
  });
}

export function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Course> }) =>
      courseService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COURSES_ADMIN_KEY] });
      toast.success("Course updated");
    },
  });
}

export function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [COURSES_ADMIN_KEY] });
      toast.success("Course deleted");
    },
  });
}
