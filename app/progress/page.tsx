"use client";
// Progress: pick an exercise, see the best weight per workout as a plain CSS bar chart.
import { useEffect, useState } from "react";
import { shortDate, useMe } from "@/lib/useMe";
import type { Exercise } from "@/lib/db";
import type { Point } from "@/lib/stats";

export default function ProgressPage() {
  const me = useMe();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exerciseId, setExerciseId] = useState("e2");
  const [points, setPoints] = useState<Point[]>([]);

  useEffect(() => { fetch("/api/exercises").then((r) => r.json()).then(setExercises); }, []);
  useEffect(() => {
    if (!me) return;
    fetch(`/api/progress?owner=${me}&exercise=${exerciseId}`).then((r) => r.json()).then(setPoints);
  }, [me, exerciseId]);

  const max = Math.max(1, ...points.map((p) => p.best));
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Progress</h1>
          <p className="sub">Best weight for one exercise, workout by workout.</p>
        </div>
      </div>
      <label style={{ maxWidth: 320, marginBottom: 16 }}>Exercise
        <select value={exerciseId} onChange={(e) => setExerciseId(e.target.value)}>
          {exercises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
        </select>
      </label>
      {points.length === 0 && <div className="card empty"><strong>Nothing logged for this exercise</strong><span className="muted">Log a workout with it and the bars show up.</span></div>}
      {points.length > 0 && (
        <div className="card">
          <div className="bars" role="img" aria-label="Bar chart of best weight per workout">
            {points.map((p, i) => (
              <div key={i} className="bar-col">
                <span className="bar-val">{p.best}</span>
                <div className="bar" style={{ height: `${Math.round((p.best / max) * 100)}%` }} />
                <span className="bar-date">{shortDate(p.date)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
