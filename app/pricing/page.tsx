"use client";
import { useState } from "react";

// ZOMBIE: no prices yet. Pick your prices, create matching Prices in Stripe (test mode),
// and show them here. Free should keep 3 routines and basic charts. Pro unlocks the rest.
const PLANS = [
  { id: "plus", name: "Plus", price: "Set your price", perks: ["Unlimited routines", "Progress charts for every exercise", "Export your workouts"] },
  { id: "pro", name: "Pro", price: "Set your price", perks: ["Everything in Plus", "AI plan for me", "Apple Health and Google Fit sync"] },
];

export default function PricingPage() {
  const [error, setError] = useState("");

  async function buy(plan: string) {
    setError("");
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setError(data.error ?? "Checkout failed.");
  }

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Pricing</h1>
          <p className="sub">Half the price of the tool you&apos;re used to. Once Stripe works.</p>
        </div>
      </div>
      <div className="grid">
        {PLANS.map((p) => (
          <div key={p.id} className="card stack">
            <strong>{p.name}</strong>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{p.price}</div>
            <ul className="muted" style={{ margin: 0, paddingLeft: 18 }}>
              {p.perks.map((perk) => <li key={perk}>{perk}</li>)}
            </ul>
            <button onClick={() => buy(p.id)}>Buy {p.name}</button>
          </div>
        ))}
      </div>
      {error && <p className="error">{error}</p>}
    </>
  );
}
