import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, ExternalLink } from "lucide-react";
import {
  useCollegeAdmin,
  useDeleteCollege,
} from "@/hooks/useCollegeAdmin";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { CollegeAdmissionSearch } from "@/components/admin/CollegeAdmissionSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { College } from "@/services/collegeService";

export const Route = createFileRoute("/admin/colleges")({
  component: CollegesPage,
});

function CollegesPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: colleges = [], isLoading } = useCollegeAdmin();
  const deleteMutation = useDeleteCollege();

  const countries = [
    "all",
    ...Array.from(new Set(colleges.map((c) => c.country).filter(Boolean))),
  ];

  const filtered = colleges.filter((c) => {
    if (
      search &&
      !`${c.name} ${c.country} ${c.city ?? ""}`.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (country !== "all" && c.country !== country) return false;
    return true;
  });

  const columns: Column<College>[] = [
    {
      key: "name",
      header: "College Name",
      render: (c) => (
        <Link
          to="/admin/colleges/$id"
          params={{ id: c.id }}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {c.name}
        </Link>
      ),
    },
    { key: "country", header: "Country" },
    {
      key: "city",
      header: "City",
      render: (c) => c.city || "—",
    },
    {
      key: "ranking",
      header: "Ranking",
      render: (c) => (c.ranking ? `#${c.ranking}` : "—"),
    },
    {
      key: "approvals",
      header: "Approvals",
      render: (c) => (
        <div className="flex flex-wrap gap-1">
          {c.nmcApproved && (
            <Badge variant="secondary" className="text-[10px] bg-green-600 text-white hover:bg-green-600">
              NMC
            </Badge>
          )}
          {c.whoApproved && (
            <Badge variant="secondary" className="text-[10px] bg-green-600 text-white hover:bg-green-600">
              WHO
            </Badge>
          )}
          {c.ugcApproved && (
            <Badge variant="secondary" className="text-[10px] bg-blue-600 text-white hover:bg-blue-600">
              UGC
            </Badge>
          )}
          {c.aicteApproved && (
            <Badge variant="secondary" className="text-[10px] bg-blue-600 text-white hover:bg-blue-600">
              AICTE
            </Badge>
          )}
          {c.naacAccredited && (
            <Badge variant="secondary" className="text-[10px] bg-purple-600 text-white hover:bg-purple-600">
              NAAC
            </Badge>
          )}
          {c.hostelAvailable && (
            <Badge variant="outline" className="text-[10px]">
              Hostel
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "brochure",
      header: "Brochure",
      render: (c) =>
        c.brochureUrl ? (
          <a
            href={c.brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" />
            View
          </a>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        ),
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (c) => (
        <div className="flex items-center gap-1">
          <Link to="/admin/colleges/$id" params={{ id: c.id }}>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={() => setDeleteId(c.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <PageHeader
        title="Colleges"
        subtitle={`${filtered.length} colleges`}
        actions={
          <Link to="/admin/colleges/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add College
            </Button>
          </Link>
        }
      />

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">College List</TabsTrigger>
          <TabsTrigger value="admission">Admission Search</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-4 space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search colleges…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="All Countries" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c === "all" ? "All Countries" : c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            columns={columns}
            data={filtered}
            isLoading={isLoading}
            rowKey={(c) => c.id}
            emptyMessage="No colleges found. Add your first college."
          />
        </TabsContent>

        <TabsContent value="admission" className="mt-4">
          <CollegeAdmissionSearch />
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete College"
        description="This will permanently delete this college record."
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
