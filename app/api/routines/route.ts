import { NextResponse } from "next/server";
import { newId, readDb, writeDb } from "@/lib/db";

// ?owner=<person id> lists that person's routines.
export async function GET(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner");
  const db = await readDb();
  return NextResponse.json(owner ? db.routines.filter((r) => r.owner === owner) : db.routines);
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  if (!body.owner || !body.name) return NextResponse.json({ error: "Missing owner or name." }, { status: 400 });
  const db = await readDb();
  // ZOMBIE: the Free plan is supposed to allow 3 routines. Nothing counts them, so Free gets unlimited.
  // ZOMBIE: no validation. sets and reps can be 0, negative or 5000, and the exercise ids are not checked.
  const routine = { id: newId(), owner: String(body.owner), name: String(body.name), items: body.items ?? [] };
  db.routines.push(routine);
  await writeDb(db);
  return NextResponse.json(routine, { status: 201 });
}
