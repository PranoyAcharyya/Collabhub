'use client';

import { useCreateBlockNote } from '@blocknote/react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { useEffect, useMemo } from 'react';

interface BlockEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export default function BlockEditorInternal({
  value,
  onChange,
}: BlockEditorProps) {

  // Safe content parser
  const initialContent = useMemo(() => {
    if (!value) return undefined;

    try {
      return JSON.parse(value);
    } catch {
      // If old plain text exists, convert to block
      return [
        {
          type: 'paragraph',
          content: value,
        },
      ];
    }
  }, [value]);

  const editor = useCreateBlockNote({
    initialContent,
  });

  // Listen for changes
  useEffect(() => {
    if (!editor || !onChange) return;

    const unsubscribe = editor.onChange(() => {
      const json = editor.document;
      onChange(JSON.stringify(json));
    });

    return unsubscribe;
  }, [editor, onChange]);

  return (
    <div className="w-full min-h-[70vh] rounded-lg border bg-white shadow-sm">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}
