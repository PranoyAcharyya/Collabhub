"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

async function fetchDocuments(workspaceId: string) {
  const res = await fetch(`/api/documents?workspaceId=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

async function fetchMembers(workspaceId: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function DashboardPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [docError, setDocError] = useState<string | null>(null);
  const [memberError, setMemberError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("member");
  const [roleError, setRoleError] = useState<string | null>(null);

  // ================= MY ROLE =================
  const { data: myRoleData } = useQuery({
    queryKey: ["myRole", activeWorkspaceId],
    queryFn: async () => {
      const res = await fetch(`/api/workspaces/${activeWorkspaceId}/my-role`);
      if (!res.ok) throw new Error("Failed to fetch role");
      return res.json();
    },
    enabled: !!activeWorkspaceId,
  });

  const isAdmin = myRoleData?.role === "admin";

  // ================= CREATE DOCUMENT =================
  const createDocument = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: activeWorkspaceId,
          title: "Untitled Document",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create document");
      }

      return data;
    },
    onSuccess: (data) => {
      setDocError(null);
      router.push(
        `/dashboard/document/${data.document.id}/${slugify(
          data.document.title,
        )}`,
      );
    },
    onError: (error: any) => {
      setDocError(error.message);
    },
  });

  // ================= DELETE DOCUMENT =================
  const deleteDocument = useMutation({
    mutationFn: async (docId: string) => {
      const res = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete document");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["documents", activeWorkspaceId],
      });
    },
  });

  // add member

  const addMember = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/workspaces/${activeWorkspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          role: "member",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add member");
      }

      return data;
    },
    onSuccess: () => {
      setEmail("");
      setAddError(null);

      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspaceId],
      });
    },
    onError: (err: any) => {
      setAddError(err.message);
    },
  });

  // ================= REMOVE MEMBER =================
  const removeMember = useMutation({
    mutationFn: async (memberId: string) => {
      const res = await fetch(
        `/api/workspaces/${activeWorkspaceId}/members/${memberId}`,
        { method: "DELETE" },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to remove member");
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspaceId],
      });
    },
    onError: (error: any) => {
      setMemberError(error.message);
    },
  });

  const updateRole = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `/api/workspaces/${activeWorkspaceId}/members/${selectedMemberId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: selectedRole,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update role");
      }

      return data;
    },
    onSuccess: () => {
      setRoleError(null);

      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspaceId],
      });
    },
    onError: (err: any) => {
      setRoleError(err.message);
    },
  });

  // ================= DOCUMENTS =================
  const { data, isLoading } = useQuery({
    queryKey: ["documents", activeWorkspaceId],
    queryFn: () => fetchDocuments(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  // ================= MEMBERS =================
  const { data: membersData } = useQuery({
    queryKey: ["members", activeWorkspaceId],
    queryFn: () => fetchMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  if (!activeWorkspaceId) {
    return <div className="p-6">Select a workspace</div>;
  }

  return (
    <div className="p-6 w-full mx-auto">
      {/* ================= DOCUMENTS ================= */}
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Documents</h1>

        {isAdmin && (
          <Button
            onClick={() => createDocument.mutate()}
            disabled={createDocument.isPending}
          >
            {createDocument.isPending ? "Creating..." : "New Document"}
          </Button>
        )}
      </div>

      {docError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertDescription>{docError}</AlertDescription>
        </Alert>
      )}

      {isLoading && <p>Loading...</p>}

      <div className="space-y-3 mb-12">
        {data?.documents?.map((doc: any) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted transition"
          >
            <Link
              href={`/dashboard/document/${doc.id}/${slugify(doc.title)}`}
              className="flex-1"
            >
              <p className="font-medium">{doc.title}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(doc.created_at).toLocaleDateString()}
              </p>
            </Link>

            {/* 🔥 Only Admin Can Delete */}
            {isAdmin && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteDocument.mutate(doc.id)}
              >
                Delete
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* ================= TEAM ================= */}
      <div className="border-t pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Team Members</h2>

          {isAdmin && (
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm">Add Member</Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Member</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  <Input
                    placeholder="Enter user email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  {addError && (
                    <p className="text-sm text-red-500">{addError}</p>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => addMember.mutate()}
                    disabled={addMember.isPending}
                  >
                    {addMember.isPending ? "Adding..." : "Add Member"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {memberError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertDescription>{memberError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          {membersData?.members?.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">{member.profiles?.email}</p>
                <p className="text-xs text-muted-foreground">
                  Role: {member.role}
                </p>
              </div>

              {isAdmin && (
                <div className="flex gap-2">
                  {/* EDIT ROLE */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setSelectedRole(member.role);
                        }}
                      >
                        Edit Role
                      </Button>
                    </DialogTrigger>

                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Member Role</DialogTitle>
                      </DialogHeader>

                      <div className="space-y-4">
                        <Select
                          value={selectedRole}
                          onValueChange={(value) => setSelectedRole(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>

                        {roleError && (
                          <p className="text-sm text-red-500">{roleError}</p>
                        )}

                        <Button
                          className="w-full"
                          onClick={() => updateRole.mutate()}
                          disabled={updateRole.isPending}
                        >
                          {updateRole.isPending ? "Updating..." : "Update Role"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* REMOVE MEMBER */}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMember.mutate(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
