"use client";

import { useWorkspaceStore } from "@/store/workspaceStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function fetchDocuments(workspaceId: string) {
  const res = await fetch(`/api/documents?workspaceId=${workspaceId}`);
  if (!res.ok) throw new Error("Failed to fetch documents");
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
      // 🔥 Redirect immediately to new document
      router.push(`/dashboard/document/${data.document.id}`);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["documents", activeWorkspaceId],
    queryFn: () => fetchDocuments(activeWorkspaceId!),
    enabled: !!activeWorkspaceId,
  });

  if (!activeWorkspaceId) {
    return <div className="p-6">Select a workspace</div>;
  }

  return (
    <div className="p-6 w-full mx-auto">
      {/* Header Section */}
      <div className="flex w-full items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Documents</h1>

        <Button
          onClick={() => createDocument.mutate()}
          disabled={!activeWorkspaceId || createDocument.isPending}
        >
          {createDocument.isPending ? "Creating..." : "New Document"}
        </Button>
      </div>

      {/* Document List */}
      {isLoading && <p>Loading...</p>}

      {data?.documents?.length === 0 && (
        <p className="text-muted-foreground">No documents yet.</p>
      )}

      <div className="space-y-3">
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
    </div>
  );
}
