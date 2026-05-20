import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCreateCollege } from "@/hooks/useCollegeAdmin";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/colleges_/new")({
  component: NewCollegePage,
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
  brochureUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
  imageUrl: z
    .string()
    .url("Invalid URL")
    .optional()
    .or(z.literal("")),
});
type CollegeFormValues = z.infer<typeof collegeSchema>;

function NewCollegePage() {
  const navigate = useNavigate();
  const createMutation = useCreateCollege();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema),
    defaultValues: {
      nmcApproved: false,
      whoApproved: false,
      hostelAvailable: false,
    },
  });

  const onSubmit = (values: CollegeFormValues) => {
    createMutation.mutate(
      {
        name: values.name,
        country: values.country,
        city: values.city,
        ranking: values.ranking,
        description: values.description,
        nmcApproved: values.nmcApproved,
        whoApproved: values.whoApproved,
        hostelAvailable: values.hostelAvailable,
        brochureUrl: values.brochureUrl || undefined,
        imageUrl: values.imageUrl || undefined,
      },
      { onSuccess: () => navigate({ to: "/admin/colleges" }) },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Add College"
        breadcrumbs={[
          { label: "Colleges", to: "/admin/colleges" },
          { label: "New" },
        ]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft"
      >
        <CollegeFormFields register={register} errors={errors} control={control} />

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add College
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/colleges" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

// Shared form fields for new + edit
export function CollegeFormFields({
  register,
  errors,
  control,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: any;
}) {
  return (
    <>
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
        <Input id="imageUrl" type="url" placeholder="https://…" {...register("imageUrl")} />
        {errors.imageUrl && (
          <p className="text-xs text-destructive">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="brochureUrl">Brochure URL</Label>
        <Input id="brochureUrl" type="url" placeholder="https://…" {...register("brochureUrl")} />
        {errors.brochureUrl && (
          <p className="text-xs text-destructive">{errors.brochureUrl.message}</p>
        )}
      </div>

      {/* Toggle flags */}
      <div className="grid gap-4 sm:grid-cols-3">
        {(
          [
            { name: "nmcApproved", label: "NMC Approved" },
            { name: "whoApproved", label: "WHO Approved" },
            { name: "hostelAvailable", label: "Hostel Available" },
          ] as const
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
    </>
  );
}
