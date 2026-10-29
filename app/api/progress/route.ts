import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { progressFor } from "@/lib/stats";

// Bars for the progress page: ?owner=<person id>&exercise=<exercise id>
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams;
  const owner = q.get("owner");
  const exercise = q.get("exercise");
  if (!owner || !exercise) return NextResponse.json({ error: "Missing ?owner= or ?exercise=" }, { status: 400 });
  const db = await readDb();
  const mine = db.workouts.filter((w) => w.owner === owner);
  return NextResponse.json(progressFor(mine, exercise));
}
