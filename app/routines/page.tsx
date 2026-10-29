"use client";
// Routines: a named list of exercises with target sets and reps.
import { useCallback, useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";
import type { Exercise, Routine, RoutineItem } from "@/lib/db";

export default function RoutinesPage() {
  const me = useMe();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [name, setName] = useState("");
  const [items, setItems] = useState<RoutineItem[]>([]);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!me) return;
    fetch(`/api/routines?owner=${me}`).then((r) => r.json()).then(setRoutines);
  }, [me]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { fetch("/api/exercises").then((r) => r.json()).then(setExercises); }, []);

  const nameOf = (id: string) => exercises.find((e) => e.id === id)?.name ?? "Unknown exercise";

  function addRow() {
    if (exercises[0]) setItems([...items, { exerciseId: exercises[0].id, sets: 3, reps: 8 }]);
  }
  function change(i: number, patch: Partial<RoutineItem>) {
    setItems(items.map((it, n) => (n === i ? { ...it, ...patch } : it)));
  }

  async function save() {
    setError("");
    const res = await fetch("/api/routines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: me, name, items }),
    });
    if (!res.ok) { setError((await res.json()).error); return; }
    setName(""); setItems([]); load();
  }

  async function remove(id: string) {
    await fetch(`/api/routines/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Routines</h1>
          <p className="sub">A routine is a named list of exercises with target sets and reps.</p>
        </div>
      </div>
      <div className="grid">
        {routines.map((r) => (
          <div key={r.id} className="card stack">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>{r.name}</strong>
              <button className="ghost small-btn" onClick={() => remove(r.id)}>Delete</button>
            </div>
            <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
              {r.items.map((it, i) => <li key={i}>{nameOf(it.exerciseId)}: {it.sets} x {it.reps}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {routines.length === 0 && <div className="card empty"><strong>No routines yet</strong><span className="muted">Build one below.</span></div>}

      <h2>New routine</h2>
      <div className="card stack" style={{ maxWidth: 560 }}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Pull Day" /></label>
        {items.map((it, i) => (
          <div key={i} className="row nowrap">
            <select value={it.exerciseId} onChange={(e) => change(i, { exerciseId: e.target.value })}>
              {exercises.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
            <input type="number" value={it.sets} onChange={(e) => change(i, { sets: Number(e.target.value) })} style={{ width: 70 }} aria-label="Sets" />
            <span className="muted">x</span>
            <input type="number" value={it.reps} onChange={(e) => change(i, { reps: Number(e.target.value) })} style={{ width: 70 }} aria-label="Reps" />
          </div>
        ))}
        <div className="row">
          <button className="ghost" onClick={addRow}>Add exercise</button>
          <button onClick={save} disabled={!name || items.length === 0}>Save routine</button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}
