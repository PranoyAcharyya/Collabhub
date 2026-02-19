"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

async function fetchMembers(workspaceId: string) {
  const res = await fetch(`/api/workspaces/${workspaceId}/members`);
  if (!res.ok) throw new Error("Failed to fetch members");
  return res.json();
}

export default function TeamPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const queryClient = useQueryClient();

  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const { data, isLoading } = useQuery({
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

      if (!res.ok) throw new Error("Failed to add member");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspaceId],
      });
      setEmail("");
    },
  });

  if (!activeWorkspaceId) {
    return <div className="p-6">Select a workspace</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Team Members</h1>

      {/* Add Member */}
      <div className="flex gap-3 mb-8">
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

      {/* Members List */}
      {isLoading && <p>Loading...</p>}

      <div className="space-y-3">
        {data?.members?.map((member: any) => (
          <div
  key={member.id}
  className="flex items-center justify-between border p-3 rounded-md"
>
  <div>
    <p className="font-medium">
      {member.profiles?.email || "Unknown"}
    </p>
    <p className="text-xs text-muted-foreground">
      Role: {member.role}
    </p>
  </div>

  <Button
    variant="destructive"
    size="sm"
    onClick={async () => {
      await fetch(
        `/api/workspaces/${activeWorkspaceId}/members`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: member.id }),
        }
      );
      queryClient.invalidateQueries({
        queryKey: ["members", activeWorkspaceId],
      });
    }}
  >
    Remove
  </Button>
</div>

        ))}
      </div>
    </div>
  );
}
