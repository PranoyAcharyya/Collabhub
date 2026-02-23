"use client";

import { useEffect, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";

export function useYjsProvider(documentId: string) {
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!documentId) return;
    if (ydocRef.current) return;

   const url = "ws://localhost:1234";
    if (!url) return;

    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    const provider = new WebsocketProvider(url, documentId, ydoc);
    providerRef.current = provider;

    provider.on("status", (event: any) => {
      console.log("YJS status:", event.status);

      if (event.status === "connected") {
        setIsReady(true);
      }
    });

    return () => {
      provider.destroy();
      ydoc.destroy();
      ydocRef.current = null;
      providerRef.current = null;
      setIsReady(false);
    };
  }, [documentId]);

  return {
    ydoc: ydocRef.current,
    provider: providerRef.current,
    isReady,
  };
}