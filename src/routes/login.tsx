import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, Card, Button } from "@/components/tati";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — TATI ChildSave" },
      { name: "description", content: "Parents and guardians sign in to follow their child's TATI money journey." },
      { property: "og:title", content: "Sign in — TATI ChildSave" },
      { property: "og:description", content: "Sign in to your TATI ChildSave guardian account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Page>
      <PageHeader backTo="/" eyebrow="Guardian account" title="Welcome back" />
      <Card>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-extrabold">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-extrabold">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
            />
          </div>
          <Button to="/parent" size="lg">
            Sign in →
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          The real sign-in lives on the{" "}
          <Link to="/auth" className="font-extrabold text-primary">
            secure account page
          </Link>
          .
        </p>
      </Card>

      <p className="mt-5 text-center text-base">
        New here?{" "}
        <Link to="/signup" className="font-extrabold text-primary">
          Create an account
        </Link>
      </p>
    </Page>
  );
}
