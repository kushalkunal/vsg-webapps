import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useCreateStudent } from "@/hooks/useStudents";
import { useSettings } from "@/hooks/useSettings";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/admin/students_/new")({
  component: NewStudentPage,
});

const DEFAULT_STATUSES = [
  "New Enquiry",
  "Contacted",
  "In Progress",
  "Docs Collected",
  "Applied",
  "Admitted",
  "Not Interested",
];

const studentSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  interestedCourse: z.string().optional(),
  preferredCountry: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
  neetScore: z.coerce.number().min(0).max(720).optional(),
  status: z.string().optional(),
  notes: z.string().optional(),
  assignedCounsellor: z.string().optional(),
});
type StudentFormValues = z.infer<typeof studentSchema>;

function NewStudentPage() {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const createMutation = useCreateStudent();
  const statuses = settings?.studentStatuses ?? DEFAULT_STATUSES;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: { status: "New Enquiry" },
  });

  const onSubmit = async (values: StudentFormValues) => {
    createMutation.mutate(
      {
        fullName: values.fullName,
        phone: values.phone,
        email: values.email || undefined,
        interestedCourse: values.interestedCourse,
        preferredCountry: values.preferredCountry,
        budget: values.budget,
        neetScore: values.neetScore,
        status: values.status,
        notes: values.notes,
        assignedCounsellor: values.assignedCounsellor,
      },
      { onSuccess: () => navigate({ to: "/admin/students" }) },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Add Student"
        breadcrumbs={[
          { label: "Students", to: "/admin/students" },
          { label: "New" },
        ]}
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft"
      >
        {/* Name + Phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" {...register("fullName")} />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone *</Label>
            <Input id="phone" type="tel" {...register("phone")} />
            {errors.phone && (
              <p className="text-xs text-destructive">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Course + Country */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="interestedCourse">Interested Course</Label>
            <Input id="interestedCourse" {...register("interestedCourse")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preferredCountry">Preferred Country</Label>
            <Input id="preferredCountry" {...register("preferredCountry")} />
          </div>
        </div>

        {/* Budget + NEET Score */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input
              id="budget"
              type="number"
              placeholder="e.g. 2500000"
              {...register("budget")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="neetScore">NEET Score</Label>
            <Input
              id="neetScore"
              type="number"
              placeholder="0–720"
              {...register("neetScore")}
            />
          </div>
        </div>

        {/* Status + Counsellor */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="assignedCounsellor">Assigned Counsellor</Label>
            <Input id="assignedCounsellor" {...register("assignedCounsellor")} />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={3}
            placeholder="Any additional information…"
            {...register("notes")}
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Add Student
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: "/admin/students" })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
