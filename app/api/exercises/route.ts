import { NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/db";

export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.exercises);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body.name) return NextResponse.json({ error: "Give the exercise a name." }, { status: 400 });
  const db = await readDb();
  // ZOMBIE: no duplicate check ("Bench Press" and "bench press" can both exist) and no length limit
  // on the name. Also anyone can add to the shared library, there is no owner or approval step.
  const exercise = { id: newId(), name: String(body.name), muscle: String(body.muscle ?? "other") };
  db.exercises.push(exercise);
  await writeDb(db);
  return NextResponse.json(exercise, { status: 201 });
}
