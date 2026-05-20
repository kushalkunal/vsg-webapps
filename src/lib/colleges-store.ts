// Client-side colleges store: merges admin overlay (localStorage) with default catalog.
// In a no-backend setup, the admin's edits are persisted in their browser only.
// (Acknowledged limitation — a real DB would sync across visitors.)

import { colleges as defaultColleges, type College } from "@/data/catalog";

const KEY = "vsg.colleges.v1";

type Overlay = {
  // slug -> partial overrides; null = deleted
  edits: Record<string, Partial<College> | null>;
  // slugs of admin-added colleges
  added: College[];
};

function emptyOverlay(): Overlay {
  return { edits: {}, added: [] };
}

function readOverlay(): Overlay {
  if (typeof window === "undefined") return emptyOverlay();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyOverlay();
    const parsed = JSON.parse(raw);
    return {
      edits: parsed.edits ?? {},
      added: Array.isArray(parsed.added) ? parsed.added : [],
    };
  } catch {
    return emptyOverlay();
  }
}

function writeOverlay(o: Overlay) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(o));
  // Notify same-tab subscribers
  window.dispatchEvent(new Event("vsg:colleges-changed"));
}

export function getAllColleges(): College[] {
  const overlay = readOverlay();
  const merged: College[] = [];
  for (const c of defaultColleges) {
    const edit = overlay.edits[c.slug];
    if (edit === null) continue; // deleted
    merged.push(edit ? { ...c, ...edit } : c);
  }
  for (const a of overlay.added) {
    if (overlay.edits[a.slug] === null) continue;
    const edit = overlay.edits[a.slug];
    merged.push(edit ? { ...a, ...edit } : a);
  }
  return merged;
}

export function getCollegeBySlug(slug: string): College | undefined {
  return getAllColleges().find((c) => c.slug === slug);
}

export function isCustomCollege(slug: string): boolean {
  return readOverlay().added.some((c) => c.slug === slug);
}

export function upsertCollege(college: College) {
  const overlay = readOverlay();
  const isDefault = defaultColleges.some((c) => c.slug === college.slug);
  const isAddedAlready = overlay.added.some((c) => c.slug === college.slug);

  if (isDefault) {
    overlay.edits[college.slug] = { ...college };
  } else if (isAddedAlready) {
    overlay.added = overlay.added.map((c) => (c.slug === college.slug ? college : c));
  } else {
    overlay.added.push(college);
  }
  writeOverlay(overlay);
}

export function deleteCollege(slug: string) {
  const overlay = readOverlay();
  const isDefault = defaultColleges.some((c) => c.slug === slug);
  if (isDefault) {
    overlay.edits[slug] = null;
  } else {
    overlay.added = overlay.added.filter((c) => c.slug !== slug);
    delete overlay.edits[slug];
  }
  writeOverlay(overlay);
}

export function resetCollege(slug: string) {
  const overlay = readOverlay();
  delete overlay.edits[slug];
  writeOverlay(overlay);
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
}

export function subscribeColleges(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("vsg:colleges-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("vsg:colleges-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
