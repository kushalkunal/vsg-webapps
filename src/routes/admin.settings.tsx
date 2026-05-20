import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

const settingsSchema = z.object({
  name: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  primaryColor: z.string().optional(),
  currency: z.string().optional(),
  studentStatuses: z.array(z.object({ value: z.string() })),
  feeCategories: z.array(z.object({ value: z.string() })),
  countries: z.array(z.object({ value: z.string() })),
  dashboardWidgets: z.array(z.object({ value: z.string() })),
});
type SettingsFormValues = z.infer<typeof settingsSchema>;

function toObjArray(arr?: string[]) {
  return (arr ?? []).map((v) => ({ value: v }));
}
function toStrArray(arr: { value: string }[]) {
  return arr.map((o) => o.value).filter(Boolean);
}

function SettingsPage() {
  const { settings, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isDirty },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      studentStatuses: [],
      feeCategories: [],
      countries: [],
      dashboardWidgets: [],
    },
  });

  const statusesArray = useFieldArray({ control, name: "studentStatuses" });
  const feeCatsArray = useFieldArray({ control, name: "feeCategories" });
  const countriesArray = useFieldArray({ control, name: "countries" });
  const widgetsArray = useFieldArray({ control, name: "dashboardWidgets" });

  useEffect(() => {
    if (settings) {
      reset({
        name: settings.name ?? "",
        logoUrl: settings.logoUrl ?? "",
        primaryColor: settings.primaryColor ?? "",
        currency: settings.currency ?? "INR",
        studentStatuses: toObjArray(settings.studentStatuses),
        feeCategories: toObjArray(settings.feeCategories),
        countries: toObjArray(settings.countries),
        dashboardWidgets: toObjArray(settings.dashboardWidgets),
      });
    }
  }, [settings, reset]);

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate({
      name: values.name || undefined,
      logoUrl: values.logoUrl || undefined,
      primaryColor: values.primaryColor || undefined,
      currency: values.currency || undefined,
      studentStatuses: toStrArray(values.studentStatuses),
      feeCategories: toStrArray(values.feeCategories),
      countries: toStrArray(values.countries),
      dashboardWidgets: toStrArray(values.dashboardWidgets),
    });
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-4 rounded-xl border border-border bg-card p-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 lg:p-6">
      <PageHeader
        title="Settings"
        subtitle="Configure branding, statuses and platform options"
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Branding */}
        <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
          <h2 className="mb-4 font-display font-semibold text-foreground">
            Branding
          </h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="settingsName">Consultancy Name</Label>
              <Input
                id="settingsName"
                placeholder="Visionary Salva Group"
                {...register("name")}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                type="url"
                placeholder="https://…/logo.png"
                {...register("logoUrl")}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="primaryColor">Primary Color (hex)</Label>
                <div className="flex gap-2">
                  <Input
                    id="primaryColor"
                    placeholder="#0055FF"
                    {...register("primaryColor")}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="currency">Currency Code</Label>
                <Input
                  id="currency"
                  placeholder="INR"
                  {...register("currency")}
                />
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Student Statuses */}
        <ArraySection
          title="Student Statuses"
          description="Statuses that appear in student forms and filters."
          items={statusesArray.fields}
          onAdd={() => statusesArray.append({ value: "" })}
          onRemove={statusesArray.remove}
          register={register}
          fieldName="studentStatuses"
          placeholder="e.g. New Enquiry"
        />

        <Separator />

        {/* Fee Categories */}
        <ArraySection
          title="Fee Categories"
          description="Custom fee breakdown labels."
          items={feeCatsArray.fields}
          onAdd={() => feeCatsArray.append({ value: "" })}
          onRemove={feeCatsArray.remove}
          register={register}
          fieldName="feeCategories"
          placeholder="e.g. Hostel Fee"
        />

        <Separator />

        {/* Countries */}
        <ArraySection
          title="Countries"
          description="Countries visible in student filters and college search."
          items={countriesArray.fields}
          onAdd={() => countriesArray.append({ value: "" })}
          onRemove={countriesArray.remove}
          register={register}
          fieldName="countries"
          placeholder="e.g. Russia"
        />

        <Separator />

        {/* Dashboard Widgets */}
        <ArraySection
          title="Dashboard Widgets"
          description="Enable or disable dashboard analytics widgets."
          items={widgetsArray.fields}
          onAdd={() => widgetsArray.append({ value: "" })}
          onRemove={widgetsArray.remove}
          register={register}
          fieldName="dashboardWidgets"
          placeholder="e.g. top-countries"
        />

        <div className="pt-2">
          <Button
            type="submit"
            disabled={updateMutation.isPending || !isDirty}
          >
            {updateMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}

function ArraySection({
  title,
  description,
  items,
  onAdd,
  onRemove,
  register,
  fieldName,
  placeholder,
}: {
  title: string;
  description: string;
  items: { id: string }[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  fieldName: string;
  placeholder?: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-soft">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onAdd}
          className="shrink-0"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">None configured yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder={placeholder}
                {...register(`${fieldName}.${i}.value`)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 w-9 shrink-0 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(i)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
