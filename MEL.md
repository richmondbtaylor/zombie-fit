# MEL.md

This is a hackathon project: a half-built copy of Strava, Fitbod and MyFitnessPal paid plans (a workout tracker) that we are turning into a real SaaS product the whole group can use.

## The stack

- Next.js (App Router) + TypeScript + React. Plain CSS in `app/globals.css`, no Tailwind, no chart library (the progress chart is CSS bars).
- Data: `lib/db.ts` reads and writes `data/db.json`. `data/seed.json` is the starting data (people, exercises, routines, workouts). This is temporary.
- The math lives in `lib/stats.ts`: weekly streak, personal records, progress points, total weight moved.
- Routes: `app/api/people`, `people/[id]`, `exercises`, `exercises/[id]`, `routines`, `routines/[id]`, `workouts`, `workouts/[id]`, `stats`, `progress`, `sync` (501), `ai-plan` (501). Pages: Home (`app/page.tsx`), `log`, `history`, `routines`, `exercises`, `progress`, `records`, `profile`, `pricing`.
- "Who am I" is a dropdown (`components/PretendPicker.tsx`, `lib/useMe.ts`). There are no real accounts yet.
- Payments: `app/api/checkout/route.ts` is a stub. Stripe is not connected.
- Runs on port 3112.

## The job

Work through `ZOMBIE.md` in order: make it work, make it secure, make it compliant, connect Stripe, ship it.
Every planted problem in the code is marked with a `ZOMBIE:` comment.
Workout and body data is health data, so privacy comes first: real login, owner checks on every route, consent, and a "talk to a doctor" notice.

## Rules for agents

- Keep it running. Run `npm run build` after each change and fix what breaks.
- Never commit secrets. Keys go in `.env.local` (it is git-ignored).
- Use Stripe test mode keys only.
- Keep all sample data fake. Never add real people's health data.
- Never send health data to ads, analytics or a model company without the person's clear OK.
- When you fix a `ZOMBIE:` item, delete its comment and tick its box in `ZOMBIE.md`.
- Small commits with plain messages.
