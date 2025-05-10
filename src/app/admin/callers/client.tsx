"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Eye, EyeClosed } from "lucide-react";
import { User } from "../../../../generated/prisma";

interface Props {
  initialCallers: User[];
}

export default function ClientOnly({ initialCallers }: Props) {
  const [callers, setCallers] = useState<User[]>(initialCallers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCaller, setEditingCaller] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    showPassword?: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    showPassword: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const url = editingCaller
        ? `/api/admin/callers/${editingCaller.id}`
        : "/api/admin/callers";
      const method = editingCaller ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save caller");

      toast.success(
        editingCaller
          ? "Caller updated successfully"
          : "Caller created successfully"
      );
      setIsDialogOpen(false);
      const updatedCaller = await response.json();
      if (editingCaller) {
        setCallers((prev) =>
          prev.map((caller) =>
            caller.id === updatedCaller.id ? updatedCaller : caller
          )
        );
      } else {
        setCallers((prev) => [...prev, updatedCaller]);
      }
      resetForm();
    } catch (error) {
      console.error("Error saving caller:", error);
      toast.error("Failed to save caller");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this caller?")) return;

    try {
      const response = await fetch(`/api/admin/callers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete caller");

      toast.success("Caller deleted successfully");
      setCallers((prev) => prev.filter((caller) => caller.id !== id));
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error deleting caller:", error);
      toast.error("Failed to delete caller");
    }
  };

  const handleEdit = (caller: User) => {
    setEditingCaller(caller);
    setFormData({
      name: caller.name,
      email: caller.email,
      password: "",
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", password: "" });
    setEditingCaller(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Manage Callers</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => resetForm()}>
                <Plus className="mr-2 h-4 w-4" /> Add Caller
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCaller ? "Edit Caller" : "Add New Caller"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {editingCaller ? "New Password (optional)" : "Password"}
                  </label>
                  <div className="relative">
                    <Input
                      type={formData.showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required={!editingCaller}
                      className="pr-10"
                      placeholder={
                        editingCaller
                          ? "Leave blank to keep current password"
                          : ""
                      }
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          showPassword: !prev.showPassword,
                        }))
                      }
                    >
                      {formData.showPassword ? (
                        <EyeClosed className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {editingCaller
                    ? isLoading
                      ? "Updating..."
                      : "Update Caller"
                    : isLoading
                    ? "Creating..."
                    : "Create Caller"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callers.map((caller) => (
                <TableRow key={caller.id}>
                  <TableCell>{caller.name}</TableCell>
                  <TableCell>{caller.email}</TableCell>
                  <TableCell>${caller.balance}</TableCell>
                  <TableCell>
                    {new Date(caller.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(caller)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(caller.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
