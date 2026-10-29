import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import Sponsors from "@/components/Sponsors";
import PretendPicker from "@/components/PretendPicker";

export const metadata: Metadata = {
  title: "Zombie Fit",
  description: "A half-built workout tracker. Bring it back to life.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="zombie-bar">
          🧟 Zombie build: it half works. Read ZOMBIE.md for what to fix.
        </div>
        <nav className="nav">
          <Link href="/" className="brand">Zombie Fit</Link>
          <Link href="/">Home</Link>
          <Link href="/log">Log workout</Link>
          <Link href="/history">History</Link>
          <Link href="/routines">Routines</Link>
          <Link href="/exercises">Exercises</Link>
          <Link href="/progress">Progress</Link>
          <Link href="/records">Records</Link>
          <Link href="/profile">Profile</Link>
          <Link href="/pricing">Pricing</Link>
          <PretendPicker />
        </nav>
        <main>{children}</main>
        <Sponsors />
      </body>
    </html>
  );
}
