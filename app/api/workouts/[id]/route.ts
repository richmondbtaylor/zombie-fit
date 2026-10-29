import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: SECURITY. No owner check. Anyone with a workout id can read it, and the ids are just
// timestamps or w1, w2, w3. Fix: only return the workout when it belongs to the signed-in user.
export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const workout = db.workouts.find((w) => w.id === id);
  if (!workout) return NextResponse.json({ error: "No such workout." }, { status: 404 });
  return NextResponse.json(workout);
}

// ZOMBIE: SECURITY. Anyone can delete anyone's workout. It is also a hard delete with no undo.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  db.workouts = db.workouts.filter((w) => w.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
