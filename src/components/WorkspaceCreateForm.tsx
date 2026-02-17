"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

type Props = {
  onSuccess: () => void;
};

export function WorkspaceCreateForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [workspaceName, setWorkspaceName] = React.useState("");

  const createWorkspace = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: workspaceName }),
      });

      if (!res.ok) throw new Error("Failed to create");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      setWorkspaceName("");
      onSuccess(); // 🔥 CLOSE DIALOG
    },
  });

  return (
    <div className="space-y-4 mt-4">
      <Input
        placeholder="Workspace name"
        value={workspaceName}
        onChange={(e) => setWorkspaceName(e.target.value)}
      />

      <Button
        className="w-full"
        onClick={() => createWorkspace.mutate()}
        disabled={!workspaceName.trim() || createWorkspace.isPending}
      >
        {createWorkspace.isPending ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}
