# Zombie Fit

> A half-built copy of **Strava / Fitbod / MyFitnessPal paid plans** (a workout tracker). It runs, it kind of works, and it is not ready for real users.
> Your job tonight: bring it back to life.

**Replaces:** Strava, Fitbod and MyFitnessPal paid plans (Strava from $6.67/month, billed yearly)

**Live demo:** https://zombie-fit.vercel.app (a shared demo: data resets whenever the server restarts)
<!-- Price checked 2026-10-29 at https://www.strava.com/subscription : "$6.67 /month", "Billed at $79.99/year + tax" for the Individual plan. No monthly-billed price was shown on that page. Fitbod: fitbod.me/pricing/ returned 404 and fitbod.me shows no price, so no Fitbod number is claimed. MyFitnessPal not checked. -->

## Run it (2 minutes)

You need [Node.js 20 or newer](https://nodejs.org).

```bash
npm install
npm run dev
```

Open http://localhost:3112.

## What works

- A "Pretend to be" dropdown in the top bar picks who you are (there are no real accounts).
- Exercise library: 12 exercises, filter by muscle, add and delete.
- Routines: a named list of exercises with target sets and reps. Build one, see it, delete it.
- Log a workout: pick a routine (it fills in the sets) or go freestyle, type the weight and reps for each set, pick a date, save.
- History: every workout, newest first, with the sets and the total weight moved.
- Progress: pick an exercise and see a plain CSS bar chart of the best weight per workout. No chart library.
- Personal records page: the heaviest set for each exercise.
- Weekly streak on the home page: how many weeks in a row you worked out.
- Profile: body weight, resting heart rate and health notes.
- Pricing page (Stripe is not connected).
- 4 fake people with 5 weeks of workouts in `data/seed.json` (43 workouts). Everyone is made up.

Try it: pretend to be Maya Ortiz, open Records, and look at her squat. Then pretend to be Sam Rivera and look at the streak.

## What's broken

See [ZOMBIE.md](ZOMBIE.md). That's the to-do list for the night. Health data is private, so the security and compliance parts matter most.

## How we build tonight

- **Mel** ([openmel.dev](https://openmel.dev)) does the building. Open this folder in Mel and give it tasks from ZOMBIE.md.
- **Prompt Anything** ([promptanything.io](https://www.promptanything.io)) writes the prompts. Use it inside Mel for features, agents, customer success flows, code fixes and reading this repo.
- **MEL.md** in this folder tells Mel's agents what this project is and how to work on it.

## Submit

Fork this repo, push your work, and send your link through the submission form before the deadline.
Many people can pick the same app. The one that actually works wins.

## License

MIT. Use it, ship it, share it.
