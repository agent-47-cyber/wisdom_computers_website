"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    const { error } = await supabase!.auth.signInWithPassword({ email: email.trim(), password });
    if (error) setErr(error.message.includes("fetch") ? "No internet. Check the connection and try again." : "Email or password is wrong. Ask the owner if you forgot it.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-6 max-w-sm space-y-5">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icons/staff-192.png" alt="" className="h-14 w-14 rounded-2xl" />
        <h1 className="mt-5 text-[30px] leading-tight">Staff login</h1>
        <p className="mt-1 text-[15px] text-muted">You only do this once on each phone.</p>
      </div>
      <div><Label htmlFor="email">Email</Label><Input id="email" type="email" inputMode="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
      <div>
        <Label htmlFor="pw">Password</Label>
        <div className="relative">
          <Input id="pw" type={show ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="pr-12" />
          <button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-1 top-1 grid h-10 w-10 place-items-center rounded-lg text-muted">
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {err && <p className="rounded-xl bg-red-50 px-4 py-3 text-[15px] text-red-800" role="alert">{err}</p>}
      <Button size="xl" className="w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
    </form>
  );
}
