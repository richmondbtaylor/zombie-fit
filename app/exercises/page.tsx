"use client";
// The exercise library: browse, filter by muscle, add, delete.
import { useCallback, useEffect, useState } from "react";
import type { Exercise } from "@/lib/db";

const MUSCLES = ["chest", "back", "legs", "shoulders", "arms", "core", "other"];

export default function ExercisesPage() {
  const [list, setList] = useState<Exercise[]>([]);
  const [muscle, setMuscle] = useState("all");
  const [name, setName] = useState("");
  const [newMuscle, setNewMuscle] = useState("chest");
  const [error, setError] = useState("");

  const load = useCallback(() => {
    fetch("/api/exercises").then((r) => r.json()).then(setList);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function add() {
    setError("");
    const res = await fetch("/api/exercises", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, muscle: newMuscle }),
    });
    if (!res.ok) { setError((await res.json()).error); return; }
    setName("");
    load();
  }

  async function remove(id: string) {
    await fetch(`/api/exercises/${id}`, { method: "DELETE" });
    load();
  }

  const shown = muscle === "all" ? list : list.filter((e) => e.muscle === muscle);
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Exercises</h1>
          <p className="sub">The shared library. Pick from it when you build a routine or log a workout.</p>
        </div>
      </div>
      <div className="row" style={{ marginBottom: 16 }}>
        <label>Muscle
          <select value={muscle} onChange={(e) => setMuscle(e.target.value)}>
            <option value="all">All</option>
            {MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <span className="muted">{shown.length} exercises</span>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Muscle</th><th></th></tr></thead>
          <tbody>
            {shown.map((e) => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td><span className="pill">{e.muscle}</span></td>
                <td><button className="ghost small-btn" onClick={() => remove(e.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Add an exercise</h2>
      <div className="card stack" style={{ maxWidth: 420 }}>
        <label>Name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Face Pull" /></label>
        <label>Muscle
          <select value={newMuscle} onChange={(e) => setNewMuscle(e.target.value)}>
            {MUSCLES.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </label>
        <button onClick={add} disabled={!name}>Add exercise</button>
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
}
