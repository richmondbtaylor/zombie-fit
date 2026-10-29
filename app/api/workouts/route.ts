import { NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/db";

// List workouts, newest first. ?owner=<person id> keeps one person's.
// ZOMBIE: SECURITY. With no ?owner= this returns EVERYONE's workouts, and with ?owner=p2 it returns
// Theo's to any caller. Nothing checks who is asking. Fix: use the signed-in user, ignore ?owner=.
export async function GET(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner");
  const db = await readDb();
  const list = owner ? db.workouts.filter((w) => w.owner === owner) : db.workouts;
  return NextResponse.json([...list].sort((a, b) => b.date.localeCompare(a.date)));
}

// Save a logged workout.
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body.owner || !Array.isArray(body.sets)) {
    return NextResponse.json({ error: "Missing owner or sets." }, { status: 400 });
  }
  // ZOMBIE: no validation. A weight can be negative or text, reps can be 0 or 100000, the date can be
  // in the future, and the owner comes from the request body so anyone can log a workout for anyone.
  // ZOMBIE: no unit is saved with the weights, so 100 could be kilos or pounds.
  // ZOMBIE: no duplicate guard. Clicking Save twice makes two workouts (the button is not locked).
  const workout = {
    id: newId(),
    owner: String(body.owner),
    routineId: body.routineId ?? null,
    name: String(body.name ?? "Freestyle"),
    date: body.date ? String(body.date) : new Date().toISOString(),
    note: String(body.note ?? ""),
    sets: body.sets,
  };
  const db = await readDb();
  db.workouts.push(workout);
  await writeDb(db);
  return NextResponse.json(workout, { status: 201 });
}
