import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "No such person." }, { status: 404 });
  return NextResponse.json(person);
}

// Save the profile page.
// ZOMBIE: SECURITY. Nobody checks who is calling, and the whole body is merged into the record.
// Anyone can edit anyone, and can send {"plan":"pro"} to give themselves the paid plan for free.
// Also no checks: body weight can be 0 or 9999. Fix: check the signed-in user, copy only the
// fields the form owns, and validate the numbers.
export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const db = await readDb();
  const person = db.people.find((p) => p.id === id);
  if (!person) return NextResponse.json({ error: "No such person." }, { status: 404 });
  Object.assign(person, body, { id });
  await writeDb(db);
  return NextResponse.json(person);
}
