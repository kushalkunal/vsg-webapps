import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useStudents, useDeleteStudent } from "@/hooks/useStudents";
import { useSettings } from "@/hooks/useSettings";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { PageHeader } from "@/components/admin/PageHeader";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Student } from "@/services/studentService";

export const Route = createFileRoute("/admin/students")({
  component: StudentsPage,
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

function StudentsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading } = useStudents({
    search: search || undefined,
    status: status !== "all" ? status : undefined,
    page,
    size: 20,
  });
  const deleteMutation = useDeleteStudent();
  const { settings } = useSettings();
  const statuses = settings?.studentStatuses ?? DEFAULT_STATUSES;

  const columns: Column<Student>[] = [
    {
      key: "fullName",
      header: "Name",
      render: (s) => (
        <Link
          to="/admin/students/$id"
          params={{ id: s.id }}
          className="font-medium text-foreground hover:text-primary transition-colors"
        >
          {s.fullName}
        </Link>
      ),
    },
    { key: "phone", header: "Phone" },
    {
      key: "interestedCourse",
      header: "Course",
      render: (s) => s.interestedCourse || "—",
    },
    {
      key: "preferredCountry",
      header: "Country",
      render: (s) => s.preferredCountry || "—",
    },
    {
      key: "budget",
      header: "Budget",
      render: (s) =>
        s.budget
          ? `₹${(s.budget / 100000).toFixed(1)}L`
          : "—",
    },
    {
      key: "status",
      header: "Status",
      render: (s) =>
        s.status ? <StatusBadge status={s.status} /> : "—",
    },
    {
      key: "actions",
      header: "",
      className: "w-28",
      render: (s) => (
        <div className="flex items-center gap-1">
          <Link to="/admin/students/$id" params={{ id: s.id }}>
            <Button size="sm" variant="ghost" className="h-7 text-xs">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs text-destructive hover:text-destructive"
            onClick={() => setDeleteId(s.id)}
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
        title="Students"
        subtitle={`${data?.totalElements ?? 0} total`}
        actions={
          <Link to="/admin/students/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            className="pl-9"
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(0);
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={data?.content ?? []}
        isLoading={isLoading}
        rowKey={(s) => s.id}
        emptyMessage="No students found. Add your first student to get started."
        pagination={
          data
            ? {
                page,
                totalPages: data.totalPages,
                onPageChange: setPage,
              }
            : undefined
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete Student"
        description="This will permanently delete the student and all associated records. This action cannot be undone."
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
