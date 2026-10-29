import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";

type Ctx = { params: Promise<{ id: string }> };

// ZOMBIE: SECURITY. Anyone can delete anyone's routine. Check the signed-in user owns it first.
export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  const db = await readDb();
  db.routines = db.routines.filter((r) => r.id !== id);
  await writeDb(db);
  return NextResponse.json({ ok: true });
}
