// ZOMBIE: "AI plan for me" is not built. The dashboard button posts here and gets a 501.
// To do: send the person's goal and recent workouts to a model, get back a week of routines, and save
// them. Add a "talk to a doctor first" notice, and do not send names or medical notes to the model.
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ error: "Not built yet. AI plans are coming." }, { status: 501 });
}
