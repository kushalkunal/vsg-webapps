import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  useCollegeAdminById,
  useUpdateCollege,
  useDeleteCollege,
} from "@/hooks/useCollegeAdmin";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/colleges_/$id")({
  component: EditCollegePage,
});

const collegeSchema = z.object({
  name: z.string().min(2, "College name is required"),
  country: z.string().min(1, "Country is required"),
  city: z.string().optional(),
  ranking: z.preprocess(v => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().min(1).optional()),
  description: z.string().optional(),
  nmcApproved: z.boolean().optional(),
  whoApproved: z.boolean().optional(),
  hostelAvailable: z.boolean().optional(),
  brochureUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
});
type CollegeFormValues = z.infer<typeof collegeSchema>;

function EditCollegePage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: college, isLoading } = useCollegeAdminById(id);
  const updateMutation = useUpdateCollege();
  const deleteMutation = useDeleteCollege();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<CollegeFormValues>({ resolver: zodResolver(collegeSchema) });

  useEffect(() => {
    if (college) {
      reset({
        name: college.name,
        country: college.country,
        city: college.city ?? "",
        ranking: college.ranking,
        description: college.description ?? "",
        nmcApproved: college.nmcApproved ?? false,
        whoApproved: college.whoApproved ?? false,
        hostelAvailable: college.hostelAvailable ?? false,
        brochureUrl: college.brochureUrl ?? "",
        imageUrl: college.imageUrl ?? "",
      });
    }
  }, [college, reset]);

  const onSubmit = (values: CollegeFormValues) => {
    updateMutation.mutate({ id, data: values });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-muted-foreground">
        College not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={college.name}
          breadcrumbs={[
            { label: "Colleges", to: "/admin/colleges" },
            { label: college.name },
          ]}
        />
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => setShowDeleteDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">College Name *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="country">Country *</Label>
            <Input id="country" {...register("country")} />
            {errors.country && (
              <p className="text-xs text-destructive">{errors.country.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ranking">World Ranking</Label>
            <Input id="ranking" type="number" {...register("ranking")} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={3} {...register("description")} />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://…"
            {...register("imageUrl")}
          />
          {errors.imageUrl && (
            <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="brochureUrl">Brochure URL</Label>
          <Input
            id="brochureUrl"
            type="url"
            placeholder="https://…"
            {...register("brochureUrl")}
          />
          {errors.brochureUrl && (
            <p className="text-xs text-destructive">{errors.brochureUrl.message}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              { name: "nmcApproved" as const, label: "NMC Approved" },
              { name: "whoApproved" as const, label: "WHO Approved" },
              { name: "hostelAvailable" as const, label: "Hostel Available" },
            ]
          ).map(({ name, label }) => (
            <Controller
              key={name}
              control={control}
              name={name}
              render={({ field }) => (
                <div className="flex items-center gap-3 rounded-lg border border-border p-3">
                  <Switch
                    id={name}
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                  <Label htmlFor={name} className="cursor-pointer text-sm">
                    {label}
                  </Label>
                </div>
              )}
            />
          ))}
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/colleges" })}
          >
            Back
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete College"
        description="This will permanently delete this college record."
        loading={deleteMutation.isPending}
        variant="destructive"
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => navigate({ to: "/admin/colleges" }),
          });
        }}
      />
    </div>
  );
}
