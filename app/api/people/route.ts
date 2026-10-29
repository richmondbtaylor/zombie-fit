import { NextResponse } from "next/server";
import { readDb } from "@/lib/db";

// The "Pretend to be" list.
// ZOMBIE: SECURITY. This sends every person's full record: body weight, resting heart rate, medical
// notes and plan. The picker only needs id and name. Health data must never go out like this.
export async function GET() {
  const db = await readDb();
  return NextResponse.json(db.people);
}
