"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

async function fetchWorkspaces() {
  const res = await fetch("/api/workspaces/my");
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}

export default function WorkspacesPage() {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [leavingId, setLeavingId] = useState<string | null>(null);
  const [name, setName] = useState("");

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myWorkspaces"],
    queryFn: fetchWorkspaces,
  });

  const deleteWorkspace = async (id: string) => {
    try {
      setDeletingId(id);

      await fetch(`/api/workspaces/${id}/delete`, {
        method: "DELETE",
      });

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const leaveWorkspace = async (id: string) => {
    try {
      setLeavingId(id);

      await fetch(`/api/workspaces/${id}/leave`, {
        method: "DELETE",
      });

      await refetch();
    } catch (err) {
      console.error(err);
    } finally {
      setLeavingId(null);
    }
  };

  const updateWorkspace = async (id: string) => {
    try {
      await fetch(`/api/workspaces/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      setEditingId(null);
      setName("");

      await refetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Workspaces</h1>

      {data?.workspaces?.length === 0 && (
        <div className="text-muted-foreground text-center py-10 space-y-2">
          <p>No workspaces yet</p>
          <p className="text-sm">
            Create your first workspace to start collaborating.
          </p>
        </div>
      )}

      {data?.workspaces?.map((workspace: any) => (
        <div
          key={workspace.id}
          className="border p-4 rounded-lg flex items-center justify-between"
        >
          <div>
            {editingId === workspace.id ? (
              <div className="flex gap-2">
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Workspace name"
                  className="w-40"
                />

                <Button
                  size="sm"
                  disabled={!name || name === workspace.name}
                  onClick={() => updateWorkspace(workspace.id)}
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null);
                    setName("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <p className="font-medium">{workspace.name}</p>
            )}

            <p className="text-sm text-muted-foreground">
              Role: {workspace.role}
            </p>
          </div>

          <div className="flex gap-2">
            {workspace.role === "admin" && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={editingId !== null}
                  onClick={() => {
                    setEditingId(workspace.id);
                    setName(workspace.name);
                  }}
                >
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deletingId === workspace.id}
                  onClick={() => deleteWorkspace(workspace.id)}
                >
                  {deletingId === workspace.id ? "Deleting..." : "Delete"}
                </Button>
              </>
            )}

            {workspace.role !== "admin" && (
              <Button
                size="sm"
                disabled={leavingId === workspace.id}
                onClick={() => leaveWorkspace(workspace.id)}
              >
                {leavingId === workspace.id ? "Leaving..." : "Leave"}
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}