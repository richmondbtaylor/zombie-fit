"use client";
// History: every logged workout, newest first, with the sets and the total weight moved.
import { useCallback, useEffect, useState } from "react";
import { shortDate, useMe } from "@/lib/useMe";
import { volume } from "@/lib/stats";
import type { Exercise, Workout } from "@/lib/db";

export default function HistoryPage() {
  const me = useMe();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loaded, setLoaded] = useState(false);

  const load = useCallback(() => {
    if (!me) return;
    fetch(`/api/workouts?owner=${me}`).then((r) => r.json()).then((l) => { setWorkouts(l); setLoaded(true); });
  }, [me]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/exercises").then((r) => r.json()).then(setExercises); }, []);

  const nameOf = (id: string) => exercises.find((e) => e.id === id)?.name ?? "Unknown exercise";

  async function remove(id: string) {
    await fetch(`/api/workouts/${id}`, { method: "DELETE" });
    load();
  }

  // Group a workout's sets by exercise: "Bench Press: 65x8, 85x6, 85x6"
  function summary(w: Workout) {
    const by: Record<string, string[]> = {};
    for (const s of w.sets) (by[s.exerciseId] ??= []).push(`${s.weight}x${s.reps}`);
    return Object.entries(by);
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>History</h1>
          <p className="sub">Everything you have logged.</p>
        </div>
      </div>
      {loaded && workouts.length === 0 && (
        <div className="card empty"><strong>No workouts yet</strong><span className="muted">Log one and it shows up here.</span></div>
      )}
      <div className="list">
        {workouts.map((w) => (
          <div key={w.id} className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <div>
                <strong>{w.name}</strong> <span className="muted">{shortDate(w.date)}</span>
              </div>
              <button className="ghost small-btn" onClick={() => remove(w.id)}>Delete</button>
            </div>
            {summary(w).map(([id, sets]) => (
              <div key={id} className="small"><strong>{nameOf(id)}:</strong> <span className="muted">{sets.join(", ")}</span></div>
            ))}
            <div className="muted small">Total weight moved: {Math.round(volume(w)).toLocaleString()}{w.note ? ` · ${w.note}` : ""}</div>
          </div>
        ))}
      </div>
    </>
  );
}
