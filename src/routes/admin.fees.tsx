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
  // yearly fields
  registrationFee: z.coerce.number().min(0),
  tuitionFee: z.coerce.number().min(0),
  examinationFee: z.coerce.number().min(0),
  hostelFee: z.coerce.number().min(0),
  miscellaneousFee: z.coerce.number().min(0),
  // whole-course package fields (manually entered)
  totalPkgWithoutHostel: z.coerce.number().min(0),
  totalPkgWithHostel: z.coerce.number().min(0),
});
type FeeFormValues = z.infer<typeof feeSchema>;

// Calculated from yearly fee inputs (NOT the manual package fields)
function calcFeeWithoutHostel(v: Partial<FeeFormValues>) {
  return (Number(v.registrationFee) || 0)
       + (Number(v.tuitionFee) || 0)
       + (Number(v.examinationFee) || 0)
       + (Number(v.miscellaneousFee) || 0);
}
function calcFeeWithHostel(v: Partial<FeeFormValues>) {
  return calcFeeWithoutHostel(v) + (Number(v.hostelFee) || 0);
}

function fmt(n: number, currency = "INR") {
  const code = ["INR", "USD"].includes(currency) ? currency : "INR";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: code,
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
      registrationFee: 0,
      tuitionFee: 0,
      examinationFee: 0,
      hostelFee: 0,
      miscellaneousFee: 0,
      totalPkgWithoutHostel: 0,
      totalPkgWithHostel: 0,
      currency,
    },
  });

  const watched = watch();
  const calcedWithout = calcFeeWithoutHostel(watched);
  const calcedWith    = calcFeeWithHostel(watched);

  const openCreate = () => {
    setEditingFee(null);
    reset({
      registrationFee: 0,
      tuitionFee: 0,
      examinationFee: 0,
      hostelFee: 0,
      miscellaneousFee: 0,
      totalPkgWithoutHostel: 0,
      totalPkgWithHostel: 0,
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
      registrationFee: fee.registrationFee,
      tuitionFee: fee.tuitionFee,
      examinationFee: fee.examinationFee,
      hostelFee: fee.hostelFee,
      miscellaneousFee: fee.miscellaneousFee,
      totalPkgWithoutHostel: fee.totalPkgWithoutHostel,
      totalPkgWithHostel: fee.totalPkgWithHostel,
    });
    setSheetOpen(true);
  };

  const onSubmit = (values: FeeFormValues) => {
    const payload = {
      ...values,
      totalFee: values.totalPkgWithHostel,
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
    { key: "registrationFee", header: "Registration", render: (f) => fmt(f.registrationFee, f.currency) },
    { key: "tuitionFee", header: "Tuition (Yearly)", render: (f) => fmt(f.tuitionFee, f.currency) },
    { key: "examinationFee", header: "Exam Fee", render: (f) => fmt(f.examinationFee, f.currency) },
    { key: "hostelFee", header: "Hostel", render: (f) => fmt(f.hostelFee, f.currency) },
    { key: "totalPkgWithoutHostel", header: "Pkg w/o Hostel",
      render: (f) => fmt(f.totalPkgWithoutHostel, f.currency) },
    { key: "totalPkgWithHostel",    header: "Pkg w/ Hostel",
      render: (f) => fmt(f.totalPkgWithHostel, f.currency) },
    { key: "calcWithout", header: "Total w/o Hostel",
      render: (f) => {
        const v = (f.registrationFee||0)+(f.tuitionFee||0)+(f.examinationFee||0)+(f.miscellaneousFee||0);
        return <span>{fmt(v, f.currency)}</span>;
      }},
    { key: "calcWith", header: "Total w/ Hostel",
      render: (f) => {
        const v = (f.registrationFee||0)+(f.tuitionFee||0)+(f.examinationFee||0)+(f.hostelFee||0)+(f.miscellaneousFee||0);
        return <span className="font-semibold text-primary">{fmt(v, f.currency)}</span>;
      }},
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
              <Label>Currency</Label>
              <Controller
                control={control}
                name="currency"
                render={({ field }) => (
                  <Select value={field.value || "INR"} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR — Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Fee breakdown */}
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Fee Breakdown
              </p>
              {/* ── Yearly fees ── */}
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Per Year
              </p>
              {(
                [
                  { id: "registrationFee",  label: "Registration Fee" },
                  { id: "tuitionFee",       label: "Tuition Fee" },
                  { id: "examinationFee",   label: "Examination Fee" },
                  { id: "hostelFee",        label: "Hostel Fee" },
                  { id: "miscellaneousFee", label: "Miscellaneous" },
                ] as const
              ).map(({ id, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <Label htmlFor={id} className="w-40 shrink-0 text-sm">
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
                    <p className="text-xs text-destructive">{errors[id]?.message}</p>
                  )}
                </div>
              ))}

              {/* ── Whole course packages ── */}
              <div className="border-t border-border pt-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Whole Course Package
                </p>
                {(
                  [
                    { id: "totalPkgWithoutHostel", label: "Pkg Without Hostel" },
                    { id: "totalPkgWithHostel",    label: "Pkg With Hostel" },
                  ] as const
                ).map(({ id, label }) => (
                  <div key={id} className="mb-2 flex items-center gap-3">
                    <Label htmlFor={id} className="w-40 shrink-0 text-sm">
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
                      <p className="text-xs text-destructive">{errors[id]?.message}</p>
                    )}
                  </div>
                ))}

                {/* ── Calculated totals (auto-summed from Per Year inputs above) ── */}
                <div className="border-t border-border pt-3 space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Calculated Totals
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Fee Without Hostel</span>
                    <span className="text-sm font-semibold text-foreground">
                      {fmt(calcedWithout, watched.currency || currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-foreground">Total Fee With Hostel</span>
                    <span className="font-display text-lg font-bold text-primary">
                      {fmt(calcedWith, watched.currency || currency)}
                    </span>
                  </div>
                </div>
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
        onOpenChange={(o) => { if (!o) setDeleteFee(null); }}
      />
    </div>
  );
}
