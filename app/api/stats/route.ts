import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";
import { personalRecords, weekStart, weeklyStreak } from "@/lib/stats";

// Dashboard numbers for ?owner=<person id>: streak, this week, total, personal records.
export async function GET(req: Request) {
  const owner = new URL(req.url).searchParams.get("owner");
  if (!owner) return NextResponse.json({ error: "Missing ?owner=" }, { status: 400 });
  const db = await readDb();
  const mine = db.workouts.filter((w) => w.owner === owner);
  const thisWeek = weekStart(new Date().toISOString());
  return NextResponse.json({
    streak: weeklyStreak(mine),
    thisWeek: mine.filter((w) => weekStart(w.date) === thisWeek).length,
    total: mine.length,
    records: personalRecords(mine),
  });
}
