// ZOMBIE: "Sync with Apple Health / Google Fit" is not built. The dashboard button posts here and gets a 501.
// To do: Apple Health (HealthKit) only works inside an iPhone app, so you need a native app or a
// companion app. Google is retiring the older Google Fit API (check the current dates), so plan on Health Connect for Android. Read the
// platform rules first: health data from these sources can NOT be used for ads or sold.
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { source } = await req.json().catch(() => ({ source: null }));
  return NextResponse.json(
    { error: `Sync with ${source ?? "Apple Health or Google Fit"} is not built yet.` },
    { status: 501 },
  );
}
