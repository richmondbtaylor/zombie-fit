"use client";
// Log a workout: pick a routine (or go freestyle), then enter weight and reps for every set.
import Link from "next/link";
import { useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";
import type { Exercise, Routine } from "@/lib/db";

type Row = { exerciseId: string; weight: string; reps: string };

export default function LogPage() {
  const me = useMe();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [routineId, setRoutineId] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (me) fetch(`/api/routines?owner=${me}`).then((r) => r.json()).then(setRoutines);
  }, [me]);
  useEffect(() => { fetch("/api/exercises").then((r) => r.json()).then(setExercises); }, []);

  // Choosing a routine fills one row per target set.
  function pick(id: string) {
    setRoutineId(id);
    const r = routines.find((x) => x.id === id);
    setRows(r ? r.items.flatMap((it) => Array.from({ length: it.sets }, () => ({ exerciseId: it.exerciseId, weight: "", reps: String(it.reps) }))) : []);
  }
  function change(i: number, patch: Partial<Row>) {
    setRows(rows.map((r, n) => (n === i ? { ...r, ...patch } : r)));
  }
  function addSet() {
    const last = rows[rows.length - 1];
    setRows([...rows, { exerciseId: last?.exerciseId ?? exercises[0]?.id ?? "", weight: last?.weight ?? "", reps: last?.reps ?? "8" }]);
  }

  async function save() {
    setMsg("");
    const routine = routines.find((r) => r.id === routineId);
    // ZOMBIE: the Save button is never locked while this request runs, so a double click saves the workout twice.
    const res = await fetch("/api/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: me, routineId: routineId || null, name: routine?.name ?? "Freestyle", date, note,
        sets: rows.map((r) => ({ exerciseId: r.exerciseId, weight: r.weight, reps: Number(r.reps) })),
      }),
    });
    const data = await res.json();
    if (!res.ok) { setMsg(data.error); return; }
    setMsg("Saved.");
    setRows([]); setRoutineId(""); setNote("");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Log a workout</h1>
          <p className="sub">Pick a routine, or add sets by hand for a freestyle workout.</p>
        </div>
      </div>
      <div className="card stack" style={{ maxWidth: 640 }}>
        <div className="row">
          <label>Routine
            <select value={routineId} onChange={(e) => pick(e.target.value)}>
              <option value="">Freestyle</option>
              {routines.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </label>
          <label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label>
        </div>
        {rows.map((r, i) => (
          <div key={i} className="row nowrap">
            <select value={r.exerciseId} onChange={(e) => change(i, { exerciseId: e.target.value })}>
              {exercises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input value={r.weight} onChange={(e) => change(i, { weight: e.target.value })} placeholder="Weight" style={{ width: 90 }} aria-label="Weight" />
            <span className="muted">x</span>
            <input type="number" value={r.reps} onChange={(e) => change(i, { reps: e.target.value })} style={{ width: 70 }} aria-label="Reps" />
            <button className="ghost small-btn" onClick={() => setRows(rows.filter((_, n) => n !== i))} aria-label="Remove set">x</button>
          </div>
        ))}
        <div className="row">
          <button className="ghost" onClick={addSet} disabled={exercises.length === 0}>Add a set</button>
        </div>
        <label>Note<input value={note} onChange={(e) => setNote(e.target.value)} placeholder="How did it feel?" /></label>
        <div className="row">
          <button onClick={save} disabled={rows.length === 0}>Save workout</button>
          {msg && <span className={msg === "Saved." ? "note" : "error"}>{msg}</span>}
          {msg === "Saved." && <Link href="/history">See history</Link>}
        </div>
      </div>
    </>
  );
}
