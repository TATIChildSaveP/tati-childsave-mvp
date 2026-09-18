import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Page, PageHeader, Card, Button } from "@/components/tati";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your guardian account — TATI ChildSave" },
      {
        name: "description",
        content: "Create a TATI ChildSave guardian account and set up a private learner profile for your child.",
      },
      { property: "og:title", content: "Create your guardian account — TATI ChildSave" },
      { property: "og:description", content: "Set up a safe learner profile for your child in minutes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Page>
      <PageHeader backTo="/" eyebrow="Guardian account" title="Create your account" />
      <Card>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-extrabold">
              Your name
            </label>
            <input
              id="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Akosua Mensah"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
            />
          </div>
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
              placeholder="At least 6 characters"
              className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
            />
          </div>
          <Button to="/onboarding" size="lg">
            Continue to profile setup →
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Your child never needs an email, phone number or password. They learn under your guardian
          account. The live account form is on the{" "}
          <Link to="/auth" className="font-extrabold text-primary">
            secure account page
          </Link>
          .
        </p>
      </Card>

      <p className="mt-5 text-center text-base">
        Already have an account?{" "}
        <Link to="/login" className="font-extrabold text-primary">
          Sign in
        </Link>
      </p>
    </Page>
  );
}
