import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2, Phone, MessageCircle, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import {
  useStudent,
  useUpdateStudent,
  useDeleteStudent,
} from "@/hooks/useStudents";
import {
  useFollowups,
  useCreateFollowup,
  useDeleteFollowup,
} from "@/hooks/useFollowups";
import { useSettings } from "@/hooks/useSettings";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { buildWhatsAppLink } from "@/lib/contact";
import type { Followup } from "@/services/followupService";

export const Route = createFileRoute("/admin/students_/$id")({
  component: EditStudentPage,
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
  phone: z.string().min(10, "Valid phone required"),
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

const followupSchema = z.object({
  note: z.string().min(1, "Note is required"),
  reminderDate: z.string().optional(),
  channel: z
    .enum(["call", "whatsapp", "email", "in-person"])
    .optional(),
});
type FollowupFormValues = z.infer<typeof followupSchema>;

function EditStudentPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const statuses = settings?.studentStatuses ?? DEFAULT_STATUSES;

  const { data: student, isLoading } = useStudent(id);
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showFollowupForm, setShowFollowupForm] = useState(false);

  const { data: followups = [], isLoading: followupsLoading } =
    useFollowups(id);
  const createFollowupMutation = useCreateFollowup();
  const deleteFollowupMutation = useDeleteFollowup();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
  });

  const followupForm = useForm<FollowupFormValues>({
    resolver: zodResolver(followupSchema),
    defaultValues: { channel: "call" },
  });

  // Populate form when student loads
  useEffect(() => {
    if (student) {
      reset({
        fullName: student.fullName,
        phone: student.phone,
        email: student.email ?? "",
        interestedCourse: student.interestedCourse ?? "",
        preferredCountry: student.preferredCountry ?? "",
        budget: student.budget,
        neetScore: student.neetScore,
        status: student.status ?? "New Enquiry",
        notes: student.notes ?? "",
        assignedCounsellor: student.assignedCounsellor ?? "",
      });
    }
  }, [student, reset]);

  const onSubmit = (values: StudentFormValues) => {
    updateMutation.mutate({ id, data: values });
  };

  const onAddFollowup = (values: FollowupFormValues) => {
    createFollowupMutation.mutate(
      { studentId: id, ...values },
      {
        onSuccess: () => {
          followupForm.reset({ channel: "call" });
          setShowFollowupForm(false);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex h-full items-center justify-center p-10 text-muted-foreground">
        Student not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          title={student.fullName}
          breadcrumbs={[
            { label: "Students", to: "/admin/students" },
            { label: student.fullName },
          ]}
          subtitle={student.status ? undefined : "No status set"}
        />
        <div className="flex shrink-0 items-center gap-2">
          {student.status && <StatusBadge status={student.status} />}
          <a
            href={`tel:${student.phone}`}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Phone className="h-4 w-4" />
          </a>
          <a
            href={buildWhatsAppLink(
              `Hi ${student.fullName}, following up on your admission enquiry.`,
            )}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Student form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-soft"
      >
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

        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="interestedCourse">Interested Course</Label>
            <Input
              id="interestedCourse"
              {...register("interestedCourse")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="preferredCountry">Preferred Country</Label>
            <Input
              id="preferredCountry"
              {...register("preferredCountry")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="budget">Budget (₹)</Label>
            <Input id="budget" type="number" {...register("budget")} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="neetScore">NEET Score</Label>
            <Input
              id="neetScore"
              type="number"
              {...register("neetScore")}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue />
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
            <Input
              id="assignedCounsellor"
              {...register("assignedCounsellor")}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes</Label>
          <Textarea id="notes" rows={3} {...register("notes")} />
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
            onClick={() => navigate({ to: "/admin/students" })}
          >
            Back
          </Button>
        </div>
      </form>

      {/* Follow-ups */}
      <div className="rounded-xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display font-semibold text-foreground">
            Follow-ups
          </h2>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowFollowupForm((v) => !v)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add
          </Button>
        </div>

        {showFollowupForm && (
          <form
            onSubmit={followupForm.handleSubmit(onAddFollowup)}
            className="space-y-3 border-b border-border bg-muted/30 p-4"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Controller
                  control={followupForm.control}
                  name="channel"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reminderDate">Reminder Date</Label>
                <Input
                  id="reminderDate"
                  type="date"
                  {...followupForm.register("reminderDate")}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="note">Note *</Label>
              <Textarea
                id="note"
                rows={2}
                placeholder="What was discussed…"
                {...followupForm.register("note")}
              />
              {followupForm.formState.errors.note && (
                <p className="text-xs text-destructive">
                  {followupForm.formState.errors.note.message}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                size="sm"
                disabled={createFollowupMutation.isPending}
              >
                {createFollowupMutation.isPending && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Save
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowFollowupForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        <FollowupTimeline
          followups={followups}
          isLoading={followupsLoading}
          onDelete={(fid) => deleteFollowupMutation.mutate(fid)}
          deletingId={
            deleteFollowupMutation.isPending
              ? deleteFollowupMutation.variables
              : undefined
          }
        />
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Student"
        description="This will permanently delete this student record. This action cannot be undone."
        loading={deleteMutation.isPending}
        variant="destructive"
        onConfirm={() => {
          deleteMutation.mutate(id, {
            onSuccess: () => navigate({ to: "/admin/students" }),
          });
        }}
      />
    </div>
  );
}

function FollowupTimeline({
  followups,
  isLoading,
  onDelete,
  deletingId,
}: {
  followups: Followup[];
  isLoading: boolean;
  onDelete: (id: string) => void;
  deletingId?: string;
}) {
  if (isLoading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  if (followups.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No follow-ups recorded yet.
      </p>
    );
  }
  return (
    <div className="divide-y divide-border">
      {followups.map((f) => (
        <div key={f.id} className="flex items-start gap-3 px-5 py-4">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold uppercase text-primary">
            {f.channel?.charAt(0) ?? "N"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold capitalize text-foreground">
                {f.channel ?? "note"}
              </span>
              {f.reminderDate && (
                <span className="text-xs text-muted-foreground">
                  Reminder:{" "}
                  {new Date(f.reminderDate).toLocaleDateString("en-IN")}
                </span>
              )}
              <span className="ml-auto text-[11px] text-muted-foreground">
                {f.createdAt
                  ? new Date(f.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>
            <p className="mt-1 text-sm text-foreground">{f.note}</p>
            {f.createdBy && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                — {f.createdBy}
              </p>
            )}
          </div>
          <button
            onClick={() => onDelete(f.id)}
            disabled={deletingId === f.id}
            className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
          >
            {deletingId === f.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
