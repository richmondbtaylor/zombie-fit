"use client";
// Personal records: the heaviest set for each exercise.
import { useEffect, useState } from "react";
import { shortDate, useMe } from "@/lib/useMe";
import type { Exercise } from "@/lib/db";
import type { Pr } from "@/lib/stats";

export default function RecordsPage() {
  const me = useMe();
  const [records, setRecords] = useState<Pr[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => { fetch("/api/exercises").then((r) => r.json()).then(setExercises); }, []);
  useEffect(() => {
    if (me) fetch(`/api/stats?owner=${me}`).then((r) => r.json()).then((s) => setRecords(s.records ?? []));
  }, [me]);

  const nameOf = (id: string) => exercises.find((e) => e.id === id)?.name ?? "Unknown exercise";
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Personal records</h1>
          <p className="sub">Your heaviest set for each exercise.</p>
        </div>
      </div>
      {records.length === 0 && <div className="card empty"><strong>No records yet</strong><span className="muted">Log a workout to set your first one.</span></div>}
      {records.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Exercise</th><th>Weight</th><th>Reps</th><th>Date</th></tr></thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.exerciseId}>
                  <td>{nameOf(r.exerciseId)}</td>
                  <td><strong>{r.weight}</strong></td>
                  <td>{r.reps}</td>
                  <td>{shortDate(r.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
