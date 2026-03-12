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

  let parsedContent = null;

  try {
    parsedContent = initialContent ? JSON.parse(initialContent) : null;
  } catch {
    parsedContent = null;
  }

  // BlockNote requires a NON EMPTY block array
  const safeContent =
    Array.isArray(parsedContent) && parsedContent.length > 0
      ? parsedContent
      : [
          {
            type: "paragraph",
            content: [],
          },
        ];

  const editor = useCreateBlockNote({
    initialContent: safeContent,
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