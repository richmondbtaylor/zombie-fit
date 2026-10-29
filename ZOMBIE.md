# 🧟 ZOMBIE.md: what's broken

This app is a zombie on purpose. Pick items off this list. Every box you tick gets it closer to a product we can all use and stop paying for Strava and Fitbod.

Search the code for `ZOMBIE:` to find every planted problem.

## 1. Make it work

- [ ] Kilos and pounds are mixed with no unit field (`lib/db.ts`, `lib/stats.ts`). Maya and Sam lift in pounds, Theo in kilos, and Priya switched from kilos to pounds in week 3, so her charts jump. Add a unit to each person and each set, convert in one place, and show the unit on every number.
- [ ] Personal records pick the wrong set (`personalRecords` in `lib/stats.ts`). It compares weights as text, so "95" beats "225". It also counts warm-up sets and ignores reps. Open Records as Maya: her squat record is a 70 warm-up. Compare numbers, skip warm-ups, and think about an estimated one-rep max.
- [ ] The progress chart shows the LAST set of the day, not the heaviest (`progressFor` in `lib/stats.ts`). Back-off sets make the bars too low. Show the best set.
- [ ] The weekly streak uses UTC dates (`weekStart` in `lib/stats.ts`). Sam works out Sunday at 9pm in Miami, which is already Monday in UTC, so his 5 real weeks show as a streak of 2. Use the person's time zone (`Person.tz`).
- [ ] The streak shows 0 on a new week until you work out (`weeklyStreak` in `lib/stats.ts`). Pretend to be Theo: 4 weeks in a row, and the page says 0. If this week is empty, count from last week.
- [ ] Total weight moved on History adds kilos and pounds together (`volume` in `lib/stats.ts`).
- [ ] "Sync with Apple Health" and "Sync with Google Fit" get a 501 (`app/api/sync/route.ts`). Build it, and read section 3 first.
- [ ] "AI plan for me" says "Not built yet" (`app/api/ai-plan/route.ts`). Build it: goal and recent workouts in, a week of routines out.
- [ ] Clicking "Save workout" twice saves the workout twice (`app/log/page.tsx`). Lock the button while it saves, and make the server ignore repeats.
- [ ] Logging accepts bad numbers (`app/api/workouts/route.ts`): negative or text weights, 0 or 100000 reps, dates in the future. Check them on the server.
- [ ] Routines accept bad numbers too (`app/api/routines/route.ts`): 0 or negative sets and reps, and exercise ids that do not exist.
- [ ] Deleting an exercise breaks the routines and history that use it (`app/api/exercises/[id]/route.ts`). They show "Unknown exercise". Block the delete or archive it.
- [ ] The exercise library allows duplicates (`app/api/exercises/route.ts`).
- [ ] The Free plan limit of 3 routines is not enforced (`app/api/routines/route.ts`). Build the plan check after Stripe works (section 4).
- [ ] Body weight and resting heart rate have no unit or limits (`app/api/people/[id]/route.ts`, `app/profile/page.tsx`).

## 2. Make it secure

- [ ] There is no login. The "Pretend to be" dropdown lets anyone act as anyone (`components/PretendPicker.tsx`, `lib/useMe.ts`). Add accounts (Supabase Auth, Clerk, Auth.js...).
- [ ] Anyone can read anyone's workouts. `GET /api/workouts` with no `?owner=` returns every person's workouts, and `GET /api/workouts/[id]` has no owner check (`app/api/workouts/route.ts`, `app/api/workouts/[id]/route.ts`). Use the signed-in user and ignore `?owner=`.
- [ ] Anyone can delete anyone's workout or routine, and anyone can log a workout for anyone because the owner comes from the request body (`app/api/workouts/[id]/route.ts`, `app/api/routines/[id]/route.ts`, `app/api/workouts/route.ts`).
- [ ] `GET /api/people` sends every person's body weight, heart rate and medical notes to anyone (`app/api/people/route.ts`). The picker only needs id and name.
- [ ] `PUT /api/people/[id]` merges the whole request body into the record (`app/api/people/[id]/route.ts`). Anyone can edit anyone, and send `{"plan":"pro"}` to get the paid plan free. Copy only the fields the form owns.
- [ ] Health data is stored as plain JSON on disk (`lib/db.ts`): body weight, heart rate, medical notes. Move it to a real database, encrypt it at rest, and keep it apart from the workout data.
- [ ] Ids are guessable (`lib/db.ts`). Workout ids are `w1`, `w2` or a timestamp. Use random ids and check the record belongs to the signed-in user.
- [ ] Every API route trusts whatever it's sent. Validate input on the server.
- [ ] Anyone can add to or delete from the shared exercise library (`app/api/exercises/route.ts`).
- [ ] Data lives in `data/db.json` on disk. Move it to a real database.

## 3. Make it compliant

Workout data is health data. Plan for these rules. These are summaries in plain words, not legal advice. Ask a lawyer before you launch.

- [ ] **FTC Health Breach Notification Rule (US):** it covers health apps that are not under HIPAA. If health data leaks or is shared without the person's OK, you may have to tell the people, the FTC, and sometimes the news. The holes in section 2 are exactly this risk. Check the current rule text.
- [ ] **State health privacy laws:** for example Washington's My Health My Data Act. It asks for separate consent to collect and to share health data, lets people delete it, and limits selling it. Other states have similar laws. Check the states you launch in.
- [ ] **Apple HealthKit and Google Health Connect have their own rules:** health data you read from them can not be used for ads and can not be sold. Apple and Google also ask for a privacy policy and a clear reason for each kind of data you read. Read their current developer terms before you build the sync (`app/api/sync/route.ts`).
- [ ] **"Talk to a doctor first" notice:** the app never says it. Add a clear note on sign-up, on the home page, and next to "AI plan for me" (`app/page.tsx`). Say it is not medical advice. Do not let the AI plan give advice about injuries or medicine.
- [ ] **Consent for health fields:** the profile page (`app/profile/page.tsx`) collects medical notes with no consent screen. Ask first, say why, and make those fields optional.
- [ ] **AI plans:** if you send workouts or notes to a model, say so in the privacy policy, leave out names and medical notes, and do not let the model company train on them.
- [ ] **Subscriptions:** US auto-renewal laws (for example California) and FTC rules need clear pricing and an easy cancel.
- [ ] **GDPR (EU/UK):** health data is "special category" data. You need explicit consent and a way to withdraw it.
- [ ] **App store rules:** Apple and Google need a privacy policy, a way to delete your account inside the app, and honest data labels.
- [ ] No privacy policy or terms page.
- [ ] No way for a user to export or delete their data.

## 4. Connect Stripe

- [ ] `app/api/checkout/route.ts` returns a 501. Create a Stripe Checkout Session (test mode is fine).
- [ ] Add a webhook route that marks the account as paid.
- [ ] Lock the paid features behind the plan: more than 3 routines, the AI plan, and the sync.

## 5. Ship it

- [ ] Deploy it (Vercel, Netlify, Railway...). The JSON file database will not survive this, so do section 2 first.
- [ ] Put the live link in your README.

## What "done" looks like

Someone who has never seen it can sign up, pay, use the main feature end to end, and come back tomorrow to find their data still there.
