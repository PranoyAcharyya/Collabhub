"use client";

import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BlockEditor from "@/components/editor/BlockEditor";

async function fetchDocument(id: string) {
  const res = await fetch(`/api/documents/${id}`);
  if (!res.ok) throw new Error("Failed to fetch document");
  return res.json();
}

export default function DocumentPage() {
  const supabase = createClient();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [title, setTitle] = useState("");
  const [titleSaved, setTitleSaved] = useState(true);

  const { data, isLoading } = useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocument(id),
    enabled: !!id,
  });

  // 🔥 Initialize title + content from DB
  useEffect(() => {
    if (data?.document) {
      setTitle(data.document.title || "");
      setTitleSaved(true);

      const dbContent = data.document.content || "";
      setContent(dbContent);
      setOriginalContent(dbContent);
    }
  }, [data]);

  // ---------------- SAVE CONTENT ----------------
  const saveContent = useMutation({
    mutationFn: async (newContent: string) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });

      if (!res.ok) throw new Error("Failed to save content");
      return res.json();
    },
    onSuccess: () => {
      setOriginalContent(content);
    },
  });

  // 🔥 Autosave (2s debounce)
  useEffect(() => {
    if (!content) return;
    if (content === originalContent) return;

    const timeout = setTimeout(() => {
      if (!saveContent.isPending) {
        saveContent.mutate(content);
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [content, originalContent]);

  // ---------------- UPDATE TITLE ----------------
  const updateTitle = useMutation({
    mutationFn: async (newTitle: string) => {
      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!res.ok) throw new Error("Failed to update title");
      return res.json();
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["document", id] });
      setTitleSaved(true);

      const slug = slugify(updated.document.title);
      router.replace(`/dashboard/document/${updated.document.id}/${slug}`);
    },
  });

  function slugify(text: string) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  if (isLoading) return <div className="p-6">Loading...</div>;
  if (!data?.document) return <div className="p-6">Document not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      
      {/* TITLE */}
      <div className="flex items-center justify-between mb-4">
        <input
          className="text-3xl font-bold outline-none w-full border-b pb-2"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleSaved(false);
          }}
        />

        <Button
          size="sm"
          disabled={titleSaved || updateTitle.isPending}
          onClick={() => updateTitle.mutate(title)}
        >
          {updateTitle.isPending ? "Saving..." : "Save"}
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-6">
        {titleSaved ? "Title saved" : "Unsaved title changes"}
      </p>

      {/* 🔥 Manual Save Button */}
      <div className="flex justify-end mb-4">
        <Button
          size="sm"
          disabled={
            saveContent.isPending || content === originalContent
          }
          onClick={() => saveContent.mutate(content)}
        >
          {saveContent.isPending ? "Saving..." : "Save Content"}
        </Button>
      </div>

      {/* BLOCK EDITOR */}
      <BlockEditor
        initialContent={content}
        onChange={(val) => setContent(val)}
      />

      {/* STATUS */}
      <div className="mt-4">
        <p className="text-xs text-muted-foreground">
          {saveContent.isPending
            ? "Saving..."
            : content === originalContent
            ? "All changes saved"
            : "Unsaved changes"}
        </p>
      </div>
    </div>
  );
}