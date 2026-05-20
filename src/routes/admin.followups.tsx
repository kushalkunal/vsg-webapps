import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Loader2, Search } from "lucide-react";
import {
  useAllFollowups,
  useCreateFollowup,
  useDeleteFollowup,
} from "@/hooks/useFollowups";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/admin/EmptyState";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/admin/followups")({
  component: FollowupsPage,
});

const CHANNEL_COLORS: Record<string, string> = {
  call: "bg-blue-100 text-blue-700",
  whatsapp: "bg-green-100 text-green-700",
  email: "bg-purple-100 text-purple-700",
  "in-person": "bg-orange-100 text-orange-700",
};

const followupSchema = z.object({
  studentId: z.string().min(1, "Student ID is required"),
  note: z.string().min(1, "Note is required"),
  reminderDate: z.string().optional(),
  channel: z.enum(["call", "whatsapp", "email", "in-person"]).optional(),
});
type FollowupFormValues = z.infer<typeof followupSchema>;

function FollowupsPage() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: followups = [], isLoading } = useAllFollowups();
  const createMutation = useCreateFollowup();
  const deleteMutation = useDeleteFollowup();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FollowupFormValues>({
    resolver: zodResolver(followupSchema),
    defaultValues: { channel: "call" },
  });

  const filtered = followups.filter(
    (f) =>
      !search ||
      f.note.toLowerCase().includes(search.toLowerCase()) ||
      f.studentId.toLowerCase().includes(search.toLowerCase()),
  );

  const onSubmit = (values: FollowupFormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        reset({ channel: "call" });
        setSheetOpen(false);
      },
    });
  };

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <PageHeader
        title="Follow-ups"
        subtitle={`${followups.length} total`}
        actions={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Follow-up
          </Button>
        }
      />

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search notes…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card shadow-soft overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4">
                <Skeleton className="h-9 w-9 shrink-0 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-full max-w-xs" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState message="No follow-ups recorded yet." />
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((f) => (
              <div
                key={f.id}
                className="flex items-start gap-4 px-5 py-4 hover:bg-muted/20 transition-colors"
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold uppercase ${
                    CHANNEL_COLORS[f.channel ?? ""] ??
                    "bg-muted text-muted-foreground"
                  }`}
                >
                  {f.channel?.charAt(0) ?? "N"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold capitalize text-foreground">
                      {f.channel ?? "note"}
                    </span>
                    <Link
                      to="/admin/students/$id"
                      params={{ id: f.studentId }}
                      className="text-xs text-primary hover:underline"
                    >
                      Student #{f.studentId.slice(0, 8)}
                    </Link>
                    {f.reminderDate && (
                      <StatusBadge
                        status={`Reminder: ${new Date(f.reminderDate).toLocaleDateString("en-IN")}`}
                        className="text-[10px] py-0"
                      />
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
                  onClick={() => setDeleteId(f.id)}
                  className="shrink-0 text-muted-foreground/50 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add follow-up sheet */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-md">
          <SheetHeader>
            <SheetTitle>Add Follow-up</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                placeholder="Paste student ID…"
                {...register("studentId")}
              />
              {errors.studentId && (
                <p className="text-xs text-destructive">
                  {errors.studentId.message}
                </p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Channel</Label>
                <Controller
                  control={control}
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
                  {...register("reminderDate")}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="followupNote">Note *</Label>
              <Textarea
                id="followupNote"
                rows={4}
                placeholder="What was discussed…"
                {...register("note")}
              />
              {errors.note && (
                <p className="text-xs text-destructive">
                  {errors.note.message}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1"
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Follow-up
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSheetOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Follow-up"
        description="Remove this follow-up note permanently?"
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
