"use client";
// Profile: name, body weight, resting heart rate and health notes.
// ZOMBIE: COMPLIANCE. This page collects health data with no consent screen, no privacy policy link,
// no "talk to a doctor before you start" notice, and no way to export or delete the data.
import { useEffect, useState } from "react";
import { useMe } from "@/lib/useMe";
import type { Person } from "@/lib/db";

export default function ProfilePage() {
  const me = useMe();
  const [p, setP] = useState<Person | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (me) fetch(`/api/people/${me}`).then((r) => r.json()).then(setP);
  }, [me]);

  async function save() {
    if (!p) return;
    const res = await fetch(`/api/people/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    setMsg(res.ok ? "Saved." : "Could not save.");
  }

  if (!p) return <p className="muted">Loading...</p>;
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile</h1>
          <p className="sub">Plan: <span className="pill">{p.plan}</span></p>
        </div>
      </div>
      <div className="card stack" style={{ maxWidth: 480 }}>
        <label>Name<input value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></label>
        <label>Body weight<input type="number" value={p.bodyWeight} onChange={(e) => setP({ ...p, bodyWeight: Number(e.target.value) })} /></label>
        <label>Resting heart rate<input type="number" value={p.restingHeartRate} onChange={(e) => setP({ ...p, restingHeartRate: Number(e.target.value) })} /></label>
        <label>Health notes<textarea rows={3} value={p.healthNotes} onChange={(e) => setP({ ...p, healthNotes: e.target.value })} /></label>
        <div className="row">
          <button onClick={save}>Save profile</button>
          {msg && <span className="note">{msg}</span>}
        </div>
      </div>
    </>
  );
}
