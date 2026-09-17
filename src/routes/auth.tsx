import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Screen, Card, PrimaryButton } from "@/components/learning/primitives";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Parent sign in — TATI ChildSave" },
      { name: "description", content: "Sign in or create a parent account to follow your child's money journey." },
      { property: "og:title", content: "Parent sign in — TATI ChildSave" },
      { property: "og:description", content: "Create a parent account for TATI ChildSave." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/dashboard", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/dashboard", replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setMessage("Almost there — check your email and click the link to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMessage("Google sign-in didn't work. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/dashboard", replace: true });
  }

  return (
    <Screen>
      <div className="pt-6">
        <Link to="/" className="text-sm font-semibold text-primary">
          ← TATI ChildSave
        </Link>
        <h1 className="mt-4 text-3xl font-bold">
          {mode === "signup" ? "Create your parent account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          Parents and guardians sign in here, then add each child's learner profile.
        </p>

        <Card className="mt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label htmlFor="fullName" className="mb-1 block text-sm font-semibold">
                  Your name
                </label>
                <input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
                  placeholder="Akosua Mensah"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-semibold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-semibold">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
                placeholder="At least 6 characters"
              />
            </div>
            <PrimaryButton type="submit" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </PrimaryButton>
          </form>

          <button
            type="button"
            onClick={handleGoogle}
            className="mt-3 min-h-[48px] w-full rounded-2xl border border-border bg-background text-base font-semibold"
          >
            Continue with Google
          </button>

          {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}

          <button
            type="button"
            onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
            className="mt-4 min-h-[48px] w-full text-sm font-semibold text-primary"
          >
            {mode === "signup" ? "I already have an account" : "I need to create an account"}
          </button>
        </Card>
      </div>
    </Screen>
  );
}
