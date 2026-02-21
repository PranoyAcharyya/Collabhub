"use client";

import { useEffect, useMemo } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";

import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

interface BlockEditorProps {
  documentId: string;
  userName: string;
  onYDocChange?: (json: string) => void;
  onPresenceChange?: (users: string[]) => void;
}

export default function BlockEditorInternal({
  documentId,
  userName,
  onYDocChange,
  onPresenceChange,
}: BlockEditorProps) {

  // Create ONE Y.Doc
  const ydoc = useMemo(() => new Y.Doc(), []);

  // Create provider for this document
  const provider = useMemo(() => {
    const p = new WebsocketProvider(
      "ws://localhost:1234",
      documentId,
      ydoc
    );

    return p;
  }, [documentId]);

  // Fragment must stay constant
  const yFragment = useMemo(() => {
    return ydoc.getXmlFragment("blocknote");
  }, []);

  // Create collaborative editor
  const editor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: yFragment,
      user: {
        name: userName,
        color: "#" + Math.floor(Math.random() * 16777215).toString(16),
      },
    },
  });

  // 🔥 Save changes
  useEffect(() => {
    if (!editor || !onYDocChange) return;

    const unsubscribe = editor.onChange(() => {
      const json = editor.document;
      onYDocChange(JSON.stringify(json));
    });

    return unsubscribe;
  }, [editor, onYDocChange]);

  // 🔥 Presence tracking
  useEffect(() => {
    const awareness = provider.awareness;

    const updateUsers = () => {
      const states = Array.from(awareness.getStates().values());
      const users = states
        .map((state: any) => state.user?.name)
        .filter(Boolean);

      onPresenceChange?.(users);
    };

    awareness.on("change", updateUsers);
    updateUsers();

    return () => {
      awareness.off("change", updateUsers);
    };
  }, [provider, onPresenceChange]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      provider.destroy();
      ydoc.destroy();
    };
  }, []);

  return (
    <div className="w-full min-h-[70vh] rounded-lg border bg-white shadow-sm">
      <BlockNoteView editor={editor} theme="light" />
    </div>
  );
}