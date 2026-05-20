import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useCourseAdmin,
  useCreateCourse,
  useUpdateCourse,
  useDeleteCourse,
} from "@/hooks/useCourseAdmin";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import type { Course } from "@/services/courseService";

export const Route = createFileRoute("/admin/courses")({
  component: CoursesPage,
});

const courseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  durationMonths: z.coerce.number().min(1).optional(),
});
type CourseFormValues = z.infer<typeof courseSchema>;

function CoursesPage() {
  const { data: courses = [], isLoading } = useCourseAdmin();
  const createMutation = useCreateCourse();
  const updateMutation = useUpdateCourse();
  const deleteMutation = useDeleteCourse();

  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CourseFormValues>({ resolver: zodResolver(courseSchema) });

  const openCreate = () => {
    setEditingCourse(null);
    reset({ name: "", description: "", durationMonths: undefined });
    setShowForm(true);
  };

  const openEdit = (c: Course) => {
    setEditingCourse(c);
    reset({
      name: c.name,
      description: c.description ?? "",
      durationMonths: c.durationMonths,
    });
    setShowForm(true);
  };

  const onSubmit = (values: CourseFormValues) => {
    if (editingCourse) {
      updateMutation.mutate(
        { id: editingCourse.id, data: values },
        { onSuccess: () => { setShowForm(false); setEditingCourse(null); } },
      );
    } else {
      createMutation.mutate(values, { onSuccess: () => setShowForm(false) });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <PageHeader
        title="Courses"
        subtitle={`${courses.length} courses`}
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        }
      />

      {/* Inline form */}
      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-xl border border-border bg-card p-5 shadow-soft"
        >
          <h3 className="mb-4 font-display font-semibold text-foreground">
            {editingCourse ? "Edit Course" : "New Course"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="courseName">Course Name *</Label>
              <Input id="courseName" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationMonths">Duration (months)</Label>
              <Input
                id="durationMonths"
                type="number"
                placeholder="e.g. 48"
                {...register("durationMonths")}
              />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <Label htmlFor="courseDesc">Description</Label>
            <Textarea id="courseDesc" rows={2} {...register("description")} />
          </div>
          <div className="mt-4 flex gap-3">
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCourse ? "Save Changes" : "Add Course"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Courses list */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="space-y-0 divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="ml-auto h-4 w-16" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <EmptyState message="No courses yet. Add your first course." />
        ) : (
          <div className="divide-y divide-border">
            {courses.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {c.durationMonths
                      ? `${c.durationMonths} months`
                      : "Duration not set"}
                    {c.description && ` · ${c.description}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={() => openEdit(c)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(c.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Course"
        description="This will permanently delete this course."
        loading={deleteMutation.isPending}
        variant="destructive"
        onConfirm={() => {
          if (deleteId) {
            deleteMutation.mutate(deleteId, {
              onSuccess: () => setDeleteId(null),
            });
          }
        }}
      />
    </div>
  );
}
