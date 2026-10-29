// ZOMBIE: this "database" is a JSON file on disk. It works on your laptop and
// dies on any real host (Vercel's disk is read-only and wiped on every deploy).
// Replace it with a real database (Supabase, Neon, Postgres...) before you ship.
import { promises as fs } from "fs";
import path from "path";
import seed from "@/data/seed.json";

// ZOMBIE: there is no unit field anywhere. A weight of 100 can be kilos or pounds, and the
// body weight on a Person has no unit either. Add a unit to the person and to every set.
export type SetRow = { exerciseId: string; weight: number | string; reps: number };
export type Person = {
  id: string; name: string; color: string; tz: string; plan: "free" | "pro";
  // ZOMBIE: health data (body weight, heart rate, medical notes) sits in plain JSON, readable by anyone.
  bodyWeight: number; restingHeartRate: number; healthNotes: string;
};
export type Exercise = { id: string; name: string; muscle: string };
export type RoutineItem = { exerciseId: string; sets: number; reps: number };
export type Routine = { id: string; owner: string; name: string; items: RoutineItem[] };
export type Workout = {
  id: string; owner: string; routineId: string | null; name: string;
  date: string; // ISO timestamp in UTC, like 2026-10-28T12:15:00.000Z
  note: string; sets: SetRow[];
};
export type Db = { people: Person[]; exercises: Exercise[]; routines: Routine[]; workouts: Workout[] };

// ZOMBIE: the live site (Vercel) can't write to the app folder, so it writes to /tmp instead.
// /tmp is wiped whenever the server restarts, and each server copy keeps its own. Use a real database.
const DB_PATH = process.env.VERCEL
  ? path.join("/tmp", "db.json")
  : path.join(process.cwd(), "data", "db.json");

// The seed workouts end on 2026-10-29. When the file is first made, slide them forward
// by whole weeks so the newest seed week is the current week.
const ANCHOR = Date.parse("2026-10-29T00:00:00Z");

function freshDb(): Db {
  const db = structuredClone(seed) as unknown as Db;
  const weeks = Math.max(0, Math.floor((Date.now() - ANCHOR) / (7 * 86400000)));
  for (const w of db.workouts) {
    w.date = new Date(Date.parse(w.date) + weeks * 7 * 86400000).toISOString();
  }
  return db;
}

export async function readDb(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf8")) as Db;
  } catch {
    const fresh = freshDb();
    await writeDb(fresh);
    return fresh;
  }
}

export async function writeDb(db: Db): Promise<void> {
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));
}

export function newId(): string {
  // ZOMBIE: guessable ids. Anyone can walk the list by trying id+1.
  return String(Date.now());
}
