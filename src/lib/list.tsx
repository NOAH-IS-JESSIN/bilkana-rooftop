import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { itemById } from "../data/menu";

/**
 * "My list" — a guest's shortlist to show the waiter. Frontend-only by design:
 * nothing is sent, ordered or paid. Stored on the device.
 */
const KEY = "bilkana.list";
type Lines = Record<string, number>;
type Ctx = {
  lines: Lines;
  count: number;
  total: number;
  add: (id: string) => void;
  change: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};
const ListCtx = createContext<Ctx | null>(null);

export function ListProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Lines>({});

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}") as Lines;
      const clean: Lines = {};
      for (const [id, q] of Object.entries(raw)) if (itemById(id) && q > 0) clean[id] = Math.min(20, Math.floor(q));
      setLines(clean);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = (next: Lines) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    return next;
  };

  const change = useCallback((id: string, delta: number) => {
    setLines((cur) => {
      const q = Math.max(0, Math.min(20, (cur[id] ?? 0) + delta));
      const next = { ...cur };
      if (q === 0) delete next[id];
      else next[id] = q;
      return persist(next);
    });
  }, []);
  const add = useCallback((id: string) => change(id, 1), [change]);
  const remove = useCallback((id: string) => change(id, -99), [change]);
  const clear = useCallback(() => setLines(persist({})), []);

  const value = useMemo<Ctx>(() => {
    let count = 0;
    let total = 0;
    for (const [id, q] of Object.entries(lines)) {
      count += q;
      total += (itemById(id)?.price ?? 0) * q;
    }
    return { lines, count, total, add, change, remove, clear };
  }, [lines, add, change, remove, clear]);

  return <ListCtx.Provider value={value}>{children}</ListCtx.Provider>;
}

export function useList() {
  const c = useContext(ListCtx);
  if (!c) throw new Error("useList outside ListProvider");
  return c;
}
