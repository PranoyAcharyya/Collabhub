"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react"

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

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [memberError, setMemberError] = useState<string | null>(null);


  // ---------------- CREATE DOCUMENT ----------------
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

      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: (data) => {
      router.push(
        `/dashboard/document/${data.document.id}/${slugify(
          data.document.title
        )}`
      );
    },
  });

  // ---------------- DOCUMENTS ----------------
  const { data, isLoading } = useQuery({
    queryKey: ["documents", activeWorkspaceId],
    queryFn: () => fetchDocuments(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  // ---------------- MEMBERS ----------------
  const { data: membersData } = useQuery({
    queryKey: ["members", activeWorkspaceId],
    queryFn: () => fetchMembers(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

const addMember = useMutation({
  mutationFn: async () => {
    const res = await fetch(
      `/api/workspaces/${activeWorkspaceId}/members`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ["members", activeWorkspaceId],
    });
    setEmail("");
    setMemberError(null);
  },
  onError: (error: any) => {
    setMemberError(error.message);
  },
});


  if (!activeWorkspaceId) {
    return <div className="p-6">Select a workspace</div>;
  }

  return (
    <div className="p-6 w-full mx-auto">

      {/* ================= DOCUMENTS SECTION ================= */}
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Documents</h1>

        <Button
          onClick={() => createDocument.mutate()}
          disabled={!activeWorkspaceId || createDocument.isPending}
        >
          {createDocument.isPending ? "Creating..." : "New Document"}
        </Button>
      </div>

      {isLoading && <p>Loading...</p>}

      {data?.documents?.length === 0 && (
        <p className="text-muted-foreground">No documents yet.</p>
      )}

      <div className="space-y-3 mb-12">
        {data?.documents?.map((doc: any) => (
          <Link
            key={doc.id}
            href={`/dashboard/document/${doc.id}/${slugify(doc.title)}`}
            className="block p-4 border rounded-lg hover:bg-muted transition"
          >
            <p className="font-medium">{doc.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>

      {/* ================= TEAM SECTION ================= */}
      <div className="border-t pt-10">
        <h2 className="text-xl font-semibold mb-6">Team Members</h2>

        {/* Add Member */}
        <div className="flex gap-3 mb-6">
          <Input
            placeholder="User email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="border rounded-md px-3"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>

          <Button
            disabled={!email || addMember.isPending}
            onClick={() => addMember.mutate()}
          >
            {addMember.isPending ? "Adding..." : "Add"}
          </Button>
        </div>
        {memberError && (
  <Alert variant="destructive" className="mb-4">
    <AlertDescription className="flex items-center self-start w-fit"> <AlertCircleIcon /> {memberError}</AlertDescription>
  </Alert>
)}


        {/* Members List */}
        <div className="space-y-3">
          {membersData?.members?.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center justify-between border p-3 rounded-md"
            >
              <div>
                <p className="font-medium">
                  {member.profiles?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Role: {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
