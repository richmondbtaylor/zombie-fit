// The numbers behind the dashboard, records and progress pages.
import type { Workout } from "@/lib/db";

// Monday of the week a workout happened in, as YYYY-MM-DD.
export function weekStart(iso: string): string {
  // ZOMBIE: BUG. This uses the UTC date, not the person's own time zone. A workout at 9pm in Miami
  // is already tomorrow in UTC, so a Sunday-night workout lands in the NEXT week and breaks the streak.
  // Fix: use the person's tz (Person.tz) to find the local date and week.
  const d = new Date(iso.slice(0, 10) + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  return d.toISOString().slice(0, 10);
}

// How many weeks in a row (counting back from now) had at least one workout.
export function weeklyStreak(workouts: Workout[]): number {
  const weeks = new Set(workouts.map((w) => weekStart(w.date)));
  let cursor = weekStart(new Date().toISOString());
  let streak = 0;
  // ZOMBIE: BUG. A brand new week with no workout YET counts as a break, so the streak shows 0 every
  // Monday morning. Fix: if this week is empty, start counting from last week instead.
  while (weeks.has(cursor)) {
    streak++;
    const d = new Date(cursor + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 7);
    cursor = d.toISOString().slice(0, 10);
  }
  return streak;
}

export type Pr = { exerciseId: string; weight: number | string; reps: number; date: string };

// The heaviest set for each exercise.
export function personalRecords(workouts: Workout[]): Pr[] {
  const best: Record<string, Pr> = {};
  for (const w of workouts) {
    for (const s of w.sets) {
      const cur = best[s.exerciseId];
      // ZOMBIE: BUG. This compares the weights as TEXT, so "95" beats "225" (the 9 sorts after the 2).
      // It also ignores reps and warm-ups, and it mixes kilos with pounds.
      // Fix: compare numbers, skip warm-up sets, and convert units first.
      if (!cur || String(s.weight) > String(cur.weight)) {
        best[s.exerciseId] = { exerciseId: s.exerciseId, weight: s.weight, reps: s.reps, date: w.date };
      }
    }
  }
  return Object.values(best);
}

export type Point = { date: string; best: number };

// For one exercise: one bar per workout day.
export function progressFor(workouts: Workout[], exerciseId: string): Point[] {
  const sorted = [...workouts].sort((a, b) => a.date.localeCompare(b.date));
  const points: Point[] = [];
  for (const w of sorted) {
    const sets = w.sets.filter((s) => s.exerciseId === exerciseId);
    if (sets.length === 0) continue;
    // ZOMBIE: BUG. This takes the LAST set of the day, not the heaviest. The last set is often a
    // lighter back-off set, so the chart shows less than the person really lifted.
    const last = sets[sets.length - 1];
    points.push({ date: w.date, best: Number(last.weight) });
  }
  return points;
}

// Total weight moved in a workout (weight x reps, added up).
export function volume(w: Workout): number {
  // ZOMBIE: adds kilos and pounds together as if they were the same unit (see lib/db.ts, no unit field).
  return w.sets.reduce((sum, s) => sum + Number(s.weight) * s.reps, 0);
}
