import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Pencil, Loader2, Trash2, Search } from "lucide-react";
import { useFees, useCreateFee, useUpdateFee, useDeleteFee } from "@/hooks/useFees";
import { useCollegeAdmin } from "@/hooks/useCollegeAdmin";
import { useCourseAdmin } from "@/hooks/useCourseAdmin";
import { useSettings } from "@/hooks/useSettings";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { Fee } from "@/services/feeService";

export const Route = createFileRoute("/admin/fees")({
  component: FeesPage,
});

const feeSchema = z.object({
  collegeId: z.string().optional(),
  courseId: z.string().optional(),
  branch: z.string().optional(),
  currency: z.string().optional(),
  tuitionFee: z.coerce.number().min(0),
  hostelFee: z.coerce.number().min(0),
  visaFee: z.coerce.number().min(0),
  insuranceFee: z.coerce.number().min(0),
  miscellaneousFee: z.coerce.number().min(0),
});
type FeeFormValues = z.infer<typeof feeSchema>;

function calcTotal(v: Partial<FeeFormValues>) {
  return (
    (v.tuitionFee ?? 0) +
    (v.hostelFee ?? 0) +
    (v.visaFee ?? 0) +
    (v.insuranceFee ?? 0) +
    (v.miscellaneousFee ?? 0)
  );
}

function fmt(n: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

function FeesPage() {
  const { data: fees = [], isLoading } = useFees();
  const { data: colleges = [] } = useCollegeAdmin();
  const { data: courses = [] } = useCourseAdmin();
  const { settings } = useSettings();
  const currency = settings?.currency ?? "INR";

  const createMutation = useCreateFee();
  const updateMutation = useUpdateFee();
  const deleteMutation = useDeleteFee();

  const [sheetOpen, setSheetOpen]   = useState(false);
  const [editingFee, setEditingFee] = useState<Fee | null>(null);
  const [deleteFee, setDeleteFee]   = useState<Fee | null>(null);
  const [search, setSearch]         = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<FeeFormValues>({
    resolver: zodResolver(feeSchema),
    defaultValues: {
      tuitionFee: 0,
      hostelFee: 0,
      visaFee: 0,
      insuranceFee: 0,
      miscellaneousFee: 0,
      currency,
    },
  });

  const watched = watch();
  const total = calcTotal(watched);

  const openCreate = () => {
    setEditingFee(null);
    reset({
      tuitionFee: 0,
      hostelFee: 0,
      visaFee: 0,
      insuranceFee: 0,
      miscellaneousFee: 0,
      currency,
    });
    setSheetOpen(true);
  };

  const openEdit = (fee: Fee) => {
    setEditingFee(fee);
    reset({
      collegeId: fee.collegeId ?? "",
      courseId: fee.courseId ?? "",
      branch: fee.branch ?? "",
      currency: fee.currency ?? currency,
      tuitionFee: fee.tuitionFee,
      hostelFee: fee.hostelFee,
      visaFee: fee.visaFee,
      insuranceFee: fee.insuranceFee,
      miscellaneousFee: fee.miscellaneousFee,
    });
    setSheetOpen(true);
  };

  const onSubmit = (values: FeeFormValues) => {
    const payload = {
      ...values,
      totalFee: calcTotal(values),
      collegeId: values.collegeId || undefined,
      courseId: values.courseId || undefined,
      branch: values.branch || undefined,
    };
    if (editingFee) {
      updateMutation.mutate(
        { id: editingFee.id, data: payload },
        { onSuccess: () => setSheetOpen(false) },
      );
    } else {
      createMutation.mutate(payload, { onSuccess: () => setSheetOpen(false) });
    }
  };

  const collegeName = (id?: string) =>
    colleges.find((c: { id: string }) => c.id === id)?.name ?? id ?? "—";
  const courseName = (id?: string) =>
    courses.find((c: { id: string }) => c.id === id)?.name ?? id ?? "—";

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const filtered = fees.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      collegeName(f.collegeId).toLowerCase().includes(q) ||
      courseName(f.courseId).toLowerCase().includes(q) ||
      (f.branch ?? "").toLowerCase().includes(q)
    );
  });

  const columns: Column<Fee>[] = [
    { key: "college", header: "College", render: (f) => collegeName(f.collegeId) },
    { key: "course", header: "Course", render: (f) => courseName(f.courseId) },
    { key: "branch", header: "Branch", render: (f) => f.branch || "—" },
    { key: "tuitionFee", header: "Tuition", render: (f) => fmt(f.tuitionFee, f.currency) },
    { key: "hostelFee", header: "Hostel", render: (f) => fmt(f.hostelFee, f.currency) },
    { key: "totalFee", header: "Total", render: (f) => (
      <span className="font-semibold text-primary">{fmt(f.totalFee, f.currency)}</span>
    )},
    {
      key: "actions",
      header: "",
      className: "w-24",
      render: (f) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => openEdit(f)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setDeleteFee(f)}>
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <PageHeader
        title="Fee Structures"
        subtitle={`${filtered.length} of ${fees.length} entries`}
        actions={
          <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Fee
          </Button>
        }
      />

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search college, course or branch…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        isLoading={isLoading}
        rowKey={(f) => f.id}
        emptyMessage={search ? "No results match your search." : "No fee structures yet. Add the first one."}
      />

      {/* Sheet form */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent className="w-full max-w-md overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {editingFee ? "Edit Fee Structure" : "New Fee Structure"}
            </SheetTitle>
          </SheetHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            {/* College + Course selectors */}
            <div className="space-y-1.5">
              <Label>College</Label>
              <Controller
                control={control}
                name="collegeId"
                render={({ field }: { field: { value?: string; onChange: (v: string | undefined) => void } }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select college (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {colleges.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Course</Label>
              <Controller
                control={control}
                name="courseId"
                render={({ field }: { field: { value?: string; onChange: (v: string | undefined) => void } }) => (
                  <Select
                    value={field.value || "none"}
                    onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feeBranch">Branch <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input id="feeBranch" placeholder="e.g. CSE, ECE, Mechanical" {...register("branch")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="feeCurrency">Currency</Label>
              <Input id="feeCurrency" placeholder="INR" {...register("currency")} />
            </div>

            {/* Fee breakdown */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fee Breakdown
              </p>
              {(
                [
                  { id: "tuitionFee", label: "Tuition Fee" },
                  { id: "hostelFee", label: "Hostel Fee" },
                  { id: "visaFee", label: "Visa Fee" },
                  { id: "insuranceFee", label: "Insurance Fee" },
                  { id: "miscellaneousFee", label: "Miscellaneous" },
                ] as const
              ).map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <Label htmlFor={id} className="w-32 shrink-0 text-sm">
                    {label}
                  </Label>
                  <Input
                    id={id}
                    type="number"
                    min="0"
                    {...register(id)}
                    className="flex-1"
                  />
                  {errors[id] && (
                    <p className="text-xs text-destructive">
                      {errors[id]?.message}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-sm font-semibold text-foreground">
                  Total
                </span>
                <span className="font-display text-lg font-bold text-primary">
                  {fmt(total, watched.currency || currency)}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" disabled={isSaving} className="flex-1">
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editingFee ? "Save Changes" : "Add Fee"}
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
        open={!!deleteFee}
        title="Delete Fee Structure"
        description={`Delete fee entry for "${collegeName(deleteFee?.collegeId)}" / "${courseName(deleteFee?.courseId)}"${deleteFee?.branch ? ` (${deleteFee.branch})` : ""}? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteFee) { deleteMutation.mutate(deleteFee.id); setDeleteFee(null); } }}
        onCancel={() => setDeleteFee(null)}
      />
    </div>
  );
}
