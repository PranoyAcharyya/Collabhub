"use client";

import * as Y from "yjs";
import { createClient } from "@/lib/supabase/client";

export function createSupabaseYProvider(documentId: string, user: any) {
  const supabase = createClient();
  const ydoc = new Y.Doc();

  const channel = supabase.channel(`doc-${documentId}`, {
    config: {
      presence: { key: user?.id },
    },
  });

  // 🔁 Broadcast Yjs updates
  ydoc.on("update", (update) => {
    channel.send({
      type: "broadcast",
      event: "y-update",
      payload: Array.from(update),
    });
  });

  // 🔁 Listen for remote updates
  channel.on("broadcast", { event: "y-update" }, ({ payload }) => {
    Y.applyUpdate(ydoc, new Uint8Array(payload));
  });

  // 👥 Track presence
  channel
    .on("presence", { event: "sync" }, () => {})
    .subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          id: user?.id,
          email: user?.email,
        });
      }
    });

  return { ydoc, channel };
}