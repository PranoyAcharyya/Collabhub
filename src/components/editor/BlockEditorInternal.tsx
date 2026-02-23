"use client";

import { useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

interface BlockEditorProps {
  initialContent?: string;
  onChange?: (json: string) => void;
}

export default function BlockEditorInternal({
  initialContent,
  onChange,
}: BlockEditorProps) {

const editor = useCreateBlockNote({
  initialContent:
    initialContent && Array.isArray(initialContent)
      ? initialContent
      : undefined,
});

  useEffect(() => {
    if (!editor || !onChange) return;

    const unsubscribe = editor.onChange(() => {
      onChange(JSON.stringify(editor.document));
    });

    return unsubscribe;
  }, [editor, onChange]);

  return (
    <div className="w-full min-h-[70vh] rounded-lg border bg-white shadow-sm">
      <BlockNoteView editor={editor} />
    </div>
  );
}