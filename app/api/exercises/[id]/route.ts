import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: BUG. This deletes the exercise even when routines and logged workouts still use it.
// Those pages then show "Unknown exercise" and the history loses its names. Block the delete,
// or archive the exercise instead. Also nobody checks who is deleting from the shared library.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  db.exercises = db.exercises.filter((e) => e.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
