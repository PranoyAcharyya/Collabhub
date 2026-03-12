"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

async function fetchWorkspaces() {
  const res = await fetch("/api/workspaces/my");
  if (!res.ok) throw new Error("Failed to fetch workspaces");
  return res.json();
}

export default function WorkspacesPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["myWorkspaces"],
    queryFn: fetchWorkspaces,
  });

  const deleteWorkspace = async (id: string) => {
    await fetch(`/api/workspaces/${id}/delete`, {
      method: "DELETE",
    });

    refetch();
  };

  const leaveWorkspace = async (id: string) => {
    await fetch(`/api/workspaces/${id}/leave`, {
      method: "DELETE",
    });

    refetch();
  };

  if (isLoading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-10 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Workspaces</h1>

      {data?.workspaces?.map((workspace: any) => (
        <div
          key={workspace.id}
          className="border p-4 rounded-lg flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{workspace.name}</p>
            <p className="text-sm text-muted-foreground">
              Role: {workspace.role}
            </p>
          </div>

          <div className="flex gap-2">
            {workspace.role === "admin" && (
              <>
                <Button size="sm" variant="outline">
                  Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => deleteWorkspace(workspace.id)}
                >
                  Delete
                </Button>
              </>
            )}

            {workspace.role !== "admin" && (
              <Button
                size="sm"
                onClick={() => leaveWorkspace(workspace.id)}
              >
                Leave
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}