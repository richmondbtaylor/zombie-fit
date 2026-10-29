"use client";
// Home: streak, this week, total workouts, records, and the latest workouts.
import Link from "next/link";
import { useEffect, useState } from "react";
import { shortDate, useMe } from "@/lib/useMe";
import type { Workout } from "@/lib/db";

type Stats = { streak: number; thisWeek: number; total: number; records: unknown[] };

export default function Home() {
  const me = useMe();
  const [stats, setStats] = useState<Stats | null>(null);
  const [recent, setRecent] = useState<Workout[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    if (!me) return;
    fetch(`/api/stats?owner=${me}`).then((r) => r.json()).then(setStats);
    fetch(`/api/workouts?owner=${me}`).then((r) => r.json()).then((l: Workout[]) => setRecent(l.slice(0, 4)));
  }, [me]);

  // Both buttons are planted 501s. They show the message the server sends back.
  async function call(url: string, body: object) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setNote(data.error ?? "Done.");
  }

  // ZOMBIE: COMPLIANCE. Nothing in the app tells people to talk to a doctor before they start a
  // workout plan. Add a clear notice here, on sign-up and next to "AI plan for me".
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Home</h1>
          <p className="sub">Log your sets. Watch your lifts go up.</p>
        </div>
        <Link href="/log" className="btn">Log a workout</Link>
      </div>
      <div className="stats">
        <div className="stat"><span className="stat-num">{stats ? `${stats.streak} wk` : "-"}</span><span className="stat-label">Weekly streak</span></div>
        <div className="stat"><span className="stat-num">{stats?.thisWeek ?? "-"}</span><span className="stat-label">Workouts this week</span></div>
        <div className="stat"><span className="stat-num">{stats?.total ?? "-"}</span><span className="stat-label">Workouts in total</span></div>
        <div className="stat"><span className="stat-num">{stats?.records.length ?? "-"}</span><span className="stat-label">Personal records</span></div>
      </div>

      <div className="row" style={{ marginBottom: 8 }}>
        <button className="ghost" onClick={() => call("/api/sync", { source: "Apple Health" })}>Sync with Apple Health</button>
        <button className="ghost" onClick={() => call("/api/sync", { source: "Google Fit" })}>Sync with Google Fit</button>
        <button className="ghost" onClick={() => call("/api/ai-plan", {})}>AI plan for me</button>
      </div>
      {note && <p className="error">{note}</p>}

      <h2>Latest workouts</h2>
      {recent.length === 0 && (
        <div className="card empty">
          <strong>No workouts yet</strong>
          <span className="muted">Log your first one and it shows up here.</span>
        </div>
      )}
      <div className="list">
        {recent.map((w) => (
          <div key={w.id} className="card row" style={{ justifyContent: "space-between" }}>
            <div>
              <strong>{w.name}</strong>
              <div className="muted small">{w.sets.length} sets</div>
            </div>
            <span className="muted">{shortDate(w.date)}</span>
          </div>
        ))}
      </div>
    </>
  );
}
