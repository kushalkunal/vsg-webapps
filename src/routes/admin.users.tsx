import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, PowerOff, Power, Loader2, KeyRound, Crown, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, type AppUser } from "@/services/userService";
import { useAuthStore } from "@/stores/authStore";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const createSchema = z.object({
  email:    z.string().email("Valid email required"),
  name:     z.string().min(2, "Name required"),
  password: z.string().min(8, "Min 8 characters"),
  role:     z.string().min(1, "Role required"),
});
type CreateForm = z.infer<typeof createSchema>;

const resetPwSchema = z.object({
  password: z.string().min(8, "Min 8 characters"),
  confirm:  z.string().min(8, "Min 8 characters"),
}).refine(d => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });
type ResetPwForm = z.infer<typeof resetPwSchema>;

function UsersPage() {
  const qc = useQueryClient();
  const authUser = useAuthStore(s => s.user);

  const [open, setOpen]                         = useState(false);
  const [deleteUser, setDeleteUser]             = useState<AppUser | null>(null);
  const [resetUser, setResetUser]               = useState<AppUser | null>(null);
  const [transferTarget, setTransferTarget]     = useState<AppUser | null>(null);

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn:  userService.list,
  });

  // Identify the currently logged-in user's record and whether they are default admin
  const me              = users.find(u => u.id === authUser?.id);
  const amIDefaultAdmin = me?.isDefault === true;

  const createMut = useMutation({
    mutationFn: (vals: CreateForm) =>
      userService.create({ email: vals.email, name: vals.name, password: vals.password, roles: [vals.role] }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setOpen(false);
      toast.success("User created successfully.");
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? "Failed to create user."),
  });

  const deleteMut = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted.");
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? "Failed to delete user."),
  });

  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      active ? userService.enable(id) : userService.disable(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? "Failed to update user."),
  });

  const makeDefaultMut = useMutation({
    mutationFn: (id: string) => userService.makeDefault(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      setTransferTarget(null);
      toast.success("Default admin transferred successfully.");
    },
    onError: (e: { response?: { data?: { message?: string } } }) =>
      toast.error(e?.response?.data?.message ?? "Failed to transfer default admin."),
  });

  const resetPwMut = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) =>
      userService.resetPassword(id, password),
    onSuccess: () => {
      setResetUser(null);
      resetPwForm.reset();
      toast.success("Password reset successfully.");
    },
    onError: () => toast.error("Failed to reset password."),
  });

  const { register, handleSubmit, setValue, reset, formState: { errors } } =
    useForm<CreateForm>({ resolver: zodResolver(createSchema), defaultValues: { role: "COUNSELLOR" } });

  const resetPwForm = useForm<ResetPwForm>({ resolver: zodResolver(resetPwSchema) });

  const onSubmit = (vals: CreateForm) => createMut.mutate(vals);

  // Determine which actions are available for a given user row
  function canToggle(u: AppUser) {
    if (u.id === authUser?.id) return false;          // can't act on yourself
    if (u.roles[0] === "ADMIN") return amIDefaultAdmin; // only default admin can act on other admins
    return true;                                        // any admin can act on counselors
  }
  function canDelete(u: AppUser) {
    if (u.id === authUser?.id) return false;
    if (u.isDefault) return false;                    // must transfer first
    if (u.roles[0] === "ADMIN") return amIDefaultAdmin;
    return true;
  }
  function canMakeDefault(u: AppUser) {
    return amIDefaultAdmin && u.roles[0] === "ADMIN" && !u.isDefault && u.isActive;
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Users"
        subtitle={`${users.length} / 5 users`}
        actions={
          <Button onClick={() => { reset(); setOpen(true); }} disabled={users.length >= 5}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/40">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Name</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">
                    <div className="flex items-center gap-2">
                      {u.name}
                      {u.id === authUser?.id && (
                        <span className="text-xs text-muted-foreground">(you)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Badge variant={u.roles[0] === "ADMIN" ? "default" : "secondary"}>
                        {u.roles[0]}
                      </Badge>
                      {u.isDefault && (
                        <Badge variant="outline" className="gap-1 border-amber-400 text-amber-600 dark:text-amber-400">
                          <Crown className="h-3 w-3" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={u.isActive ? "outline" : "destructive"}>
                      {u.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Reset password â€” any admin can do this for anyone */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => { resetPwForm.reset(); setResetUser(u); }}
                        title="Reset Password"
                      >
                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                      </Button>

                      {/* Make Default Admin â€” only default admin, only on other active admins */}
                      {canMakeDefault(u) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setTransferTarget(u)}
                          title="Make Default Admin"
                        >
                          <ShieldCheck className="h-4 w-4 text-amber-500" />
                        </Button>
                      )}

                      {/* Enable / Disable */}
                      {canToggle(u) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleMut.mutate({ id: u.id, active: !u.isActive })}
                          title={u.isActive ? "Deactivate" : "Activate"}
                        >
                          {u.isActive
                            ? <PowerOff className="h-4 w-4 text-muted-foreground" />
                            : <Power className="h-4 w-4 text-green-600" />}
                        </Button>
                      )}

                      {/* Delete */}
                      {canDelete(u) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteUser(u)}
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No users yet. Add your first user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create user dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add User</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
            {createMut.error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {(createMut.error as { response?: { data?: { message?: string } } })?.response?.data?.message
                  || "Failed to create user."}
              </div>
            )}
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" placeholder="john@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Password</Label>
              <Input type="password" placeholder="Min 8 characters" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select defaultValue="COUNSELLOR" onValueChange={(v) => setValue("role", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COUNSELLOR">Counsellor</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending}>
                {createMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create User
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset password dialog */}
      <Dialog open={!!resetUser} onOpenChange={(o) => { if (!o) setResetUser(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password â€” {resetUser?.name}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={resetPwForm.handleSubmit((vals) =>
              resetUser && resetPwMut.mutate({ id: resetUser.id, password: vals.password })
            )}
            className="space-y-4 pt-2"
          >
            <div className="space-y-1.5">
              <Label>New Password</Label>
              <Input type="password" placeholder="Min 8 characters" {...resetPwForm.register("password")} />
              {resetPwForm.formState.errors.password && (
                <p className="text-xs text-destructive">{resetPwForm.formState.errors.password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Repeat password" {...resetPwForm.register("confirm")} />
              {resetPwForm.formState.errors.confirm && (
                <p className="text-xs text-destructive">{resetPwForm.formState.errors.confirm.message}</p>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setResetUser(null)}>Cancel</Button>
              <Button type="submit" disabled={resetPwMut.isPending}>
                {resetPwMut.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Reset Password
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteUser}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteUser?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => { if (deleteUser) { deleteMut.mutate(deleteUser.id); setDeleteUser(null); } }}
        onCancel={() => setDeleteUser(null)}
      />

      {/* Transfer default admin confirm */}
      <ConfirmDialog
        open={!!transferTarget}
        title="Transfer Default Admin"
        description={`Make "${transferTarget?.name}" the new default admin? You will lose the ability to manage other admins.`}
        confirmLabel="Transfer"
        variant="default"
        onConfirm={() => { if (transferTarget) makeDefaultMut.mutate(transferTarget.id); }}
        onCancel={() => setTransferTarget(null)}
      />
    </div>
  );
}
