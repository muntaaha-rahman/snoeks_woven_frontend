import { openDB, type DBSchema } from "idb";
import { createVisit, NetworkError } from "../api/client";
import type { VisitInput } from "../api/types";

interface QueueItem {
  id: string;
  data: VisitInput;
  queued_at: string;
}

interface QueueDB extends DBSchema {
  pending_visits: {
    key: string;
    value: QueueItem;
  };
}

const dbPromise = openDB<QueueDB>("snoeks-woven-offline", 1, {
  upgrade(db) {
    db.createObjectStore("pending_visits", { keyPath: "id" });
  },
});

/** Queue a measurement locally when it can't reach the server right now. */
export async function queueVisit(data: VisitInput): Promise<string> {
  const db = await dbPromise;
  const id = crypto.randomUUID();
  await db.put("pending_visits", { id, data, queued_at: new Date().toISOString() });
  return id;
}

export async function listQueuedVisits(): Promise<QueueItem[]> {
  const db = await dbPromise;
  return db.getAll("pending_visits");
}

export async function queuedCount(): Promise<number> {
  const db = await dbPromise;
  return db.count("pending_visits");
}

async function removeQueuedVisit(id: string): Promise<void> {
  const db = await dbPromise;
  await db.delete("pending_visits", id);
}

type FlushListener = (remaining: number) => void;
const listeners = new Set<FlushListener>();

export function onQueueChange(listener: FlushListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let flushing = false;

/** Attempt to send every queued measurement. Safe to call repeatedly (e.g. on 'online'). */
export async function flushQueue(): Promise<void> {
  if (flushing) return;
  flushing = true;
  try {
    const items = await listQueuedVisits();
    for (const item of items) {
      try {
        await createVisit(item.data);
        await removeQueuedVisit(item.id);
      } catch (err) {
        if (err instanceof NetworkError) {
          break; // still offline, stop and try again next time
        }
        // A non-network error (e.g. validation) would just repeat forever; drop it
        // rather than block the rest of the queue, but keep it discoverable via console.
        console.error("Dropping unsendable queued visit", item.id, err);
        await removeQueuedVisit(item.id);
      }
    }
  } finally {
    flushing = false;
    const remaining = await queuedCount();
    listeners.forEach((listener) => listener(remaining));
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    flushQueue();
  });
}
