import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Page,
  PageHeader,
  Card,
  CardTitle,
  CardNote,
  Button,
  Badge,
  ProgressBar,
  Avatar,
  AVATAR_KEYS,
  StatCard,
} from "@/components/tati";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Child profile setup — TATI ChildSave" },
      {
        name: "description",
        content: "Set up your child's private TATI Junior learner profile: name, age and character.",
      },
      { property: "og:title", content: "Child profile setup — TATI ChildSave" },
      { property: "og:description", content: "Three quick steps to start your child's money journey." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Onboarding,
});

const ages = [8, 9, 10, 11, 12];
const characters = [
  { key: "kojo", name: "Kojo" },
  { key: "ama", name: "Ama" },
  { key: "kwame", name: "Kwame" },
  { key: "abena", name: "Akua" },
  { key: "kofi", name: "Kofi" },
  { key: "esi", name: "Esi" },
] as const;

function Onboarding() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Kojo");
  const [age, setAge] = useState(10);
  const [avatar, setAvatar] = useState<string>("kojo");

  return (
    <Page>
      <PageHeader
        backTo="/"
        eyebrow="Child profile setup"
        title={step === 1 ? "Basic Details" : step === 2 ? "Avatar & Theme" : "All Set!"}
        listenable
      />

      <div className="mb-5 flex items-center justify-between gap-3">
        <Badge tone="neutral" icon="🎓">
          Step {step} of 3
        </Badge>
        <span className="text-sm font-extrabold text-muted-foreground">
          {Math.round((step / 3) * 100)}%
        </span>
      </div>
      <ProgressBar value={step} max={3} className="mb-6" />

      {step === 1 ? (
        <div className="space-y-5">
          <h2 className="text-3xl font-extrabold leading-tight">Who's starting their TATI journey?</h2>
          <p className="text-lg text-muted-foreground">
            Create a profile for your child. You can add another child later.
          </p>

          <Card>
            <div className="flex gap-3">
              <Avatar avatar="kojo" size="md" />
              <div>
                <CardTitle>🔒 Private learner profile</CardTitle>
                <CardNote>
                  No child email, phone number or password required. Your child learns safely under
                  your guardian account.
                </CardNote>
              </div>
            </div>
          </Card>

          <div>
            <label htmlFor="childName" className="mb-1 block text-base font-bold">
              Child's first name or nickname
            </label>
            <input
              id="childName"
              value={name}
              maxLength={15}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[56px] w-full rounded-2xl bg-card px-4 text-lg font-bold shadow-card"
            />
            <p className="mt-2 text-sm text-muted-foreground">
              This is how TATI will greet your child in their lessons.
            </p>
          </div>

          <div>
            <p className="text-base font-bold">How old are they?</p>
            <p className="text-sm text-muted-foreground">
              TATI Junior is customised for learners aged 8 to 12.
            </p>
            <div className="mt-3 grid grid-cols-5 gap-2">
              {ages.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setAge(a)}
                  aria-pressed={age === a}
                  className={cn(
                    "min-h-[56px] rounded-2xl text-lg font-extrabold shadow-card",
                    age === a ? "bg-primary text-primary-foreground" : "bg-card",
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <Card tone="muted" className="flex items-center gap-2">
            <span aria-hidden="true">✨</span>
            <span className="text-base font-bold">Primary {age - 5} curriculum level selected</span>
          </Card>

          <Button size="lg" onClick={() => setStep(2)}>
            Continue →
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            You will choose your child's avatar next.
          </p>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-5">
          <h2 className="text-3xl font-extrabold leading-tight">Choose your TATI character</h2>
          <p className="text-lg text-muted-foreground">
            Pick a character that feels like you! You can always change this later.
          </p>

          <Card className="flex items-center gap-4">
            <Avatar avatar={avatar} size="lg" ring="success" name={name} />
            <div>
              <p className="text-sm font-extrabold uppercase tracking-wide text-success">Current pick</p>
              <p className="text-xl font-extrabold">
                {name} (Age {age})
              </p>
              <p className="text-base italic text-muted-foreground">
                "Ready to save for my school bag!"
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {characters.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setAvatar(c.key)}
                aria-pressed={avatar === c.key}
                className={cn(
                  "flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-2xl bg-card p-3 shadow-card",
                  avatar === c.key && "ring-2 ring-primary",
                )}
              >
                <Avatar avatar={c.key} size="md" />
                <span className="text-base font-extrabold">{c.name}</span>
                {avatar === c.key ? <Badge tone="primary" solid>Selected</Badge> : null}
              </button>
            ))}
          </div>

          <Card tone="muted">
            <CardTitle>🎨 Make it yours!</CardTitle>
            <CardNote>
              As your child completes savings goals, they will unlock new caps, badges and colours.
            </CardNote>
          </Card>

          <Button size="lg" onClick={() => setStep(3)}>
            That's Me! →
          </Button>
          <Button variant="secondary" onClick={() => setStep(1)}>
            Back to details
          </Button>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-5">
          <Card className="text-center">
            <Avatar avatar={avatar} size="xl" ring="accent" name={name} className="mx-auto" />
            <div className="mt-3 flex justify-center">
              <Badge tone="warning" icon="🎓">
                Primary {age - 5} · Age {age}
              </Badge>
            </div>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight">
              {name}, your money adventure is about to begin! 🎒
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              You'll earn, save, spend and make smart choices along the way. Every single choice
              teaches you something!
            </p>
          </Card>

          <Card>
            <p className="text-sm font-extrabold uppercase tracking-wide text-success">
              First challenge unlocked
            </p>
            <CardTitle className="mt-1">🎒 School Reopening Challenge</CardTitle>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <StatCard label="Pocket" money={50} tone="primary" icon="💰" />
              <StatCard label="Target" money={80} tone="success" icon="🎯" />
              <StatCard label="Mission" value="14 days" tone="neutral" icon="⏱" />
            </div>
          </Card>

          <Card tone="muted">
            <p className="text-base">
              <span className="font-extrabold">Parent tip:</span> hand the phone over to {name}, or
              jump into the first mission together.
            </p>
          </Card>

          <Button to="/child/home" size="lg" variant="primary">
            Start My Journey 🚀
          </Button>
          <Button to="/parent" variant="ghost">
            Manage in Parent Portal
          </Button>
        </div>
      ) : null}
    </Page>
  );
}
