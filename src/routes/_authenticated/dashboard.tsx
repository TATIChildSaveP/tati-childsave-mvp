import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Screen, Card, PrimaryButton, ProgressBar } from "@/components/learning/primitives";
import { useAddChild, useChildren, useProgress } from "@/lib/learning/progress";
import { getTrack } from "@/lib/learning/track";
import { buildInsights } from "@/lib/learning/insights";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Parent dashboard — TATI ChildSave" },
      { name: "description", content: "Follow your child's saving journey, progress and insights." },
      { property: "og:title", content: "Parent dashboard — TATI ChildSave" },
      { property: "og:description", content: "Progress and insights from your child's SAVE track." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: children, isLoading } = useChildren();
  const addChild = useAddChild();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [age, setAge] = useState(10);
  const [showForm, setShowForm] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  }

  return (
    <Screen>
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Parent space</p>
          <h1 className="text-3xl font-bold">Your children</h1>
        </div>
        <button onClick={signOut} className="min-h-[48px] text-sm font-semibold text-muted-foreground">
          Sign out
        </button>
      </header>

      {isLoading ? <p className="text-muted-foreground">Loading…</p> : null}

      <div className="space-y-4">
        {children?.map((child) => <ChildCard key={child.id} childId={child.id} name={child.name} age={child.age} />)}
      </div>

      {!isLoading && children?.length === 0 ? (
        <Card>
          <h2 className="text-lg font-bold">Add your first learner</h2>
          <p className="mt-1 text-muted-foreground">
            Each child gets their own TATI Junior profile and progress.
          </p>
        </Card>
      ) : null}

      <div className="mt-6">
        {showForm ? (
          <Card>
            <h2 className="text-lg font-bold">New learner</h2>
            <form
              className="mt-4 space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                await addChild.mutateAsync({ name, age, avatar: "kente" });
                setName("");
                setAge(10);
                setShowForm(false);
              }}
            >
              <div>
                <label htmlFor="childName" className="mb-1 block text-sm font-semibold">
                  Child's name
                </label>
                <input
                  id="childName"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kwabena"
                  className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
                />
              </div>
              <div>
                <label htmlFor="childAge" className="mb-1 block text-sm font-semibold">
                  Age
                </label>
                <input
                  id="childAge"
                  type="number"
                  min={8}
                  max={12}
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="min-h-[48px] w-full rounded-2xl border border-border bg-background px-4 text-base"
                />
              </div>
              <PrimaryButton type="submit" disabled={addChild.isPending}>
                {addChild.isPending ? "Adding…" : "Add child"}
              </PrimaryButton>
            </form>
          </Card>
        ) : (
          <PrimaryButton onClick={() => setShowForm(true)}>Add a child</PrimaryButton>
        )}
      </div>
    </Screen>
  );
}

function ChildCard({ childId, name, age }: { childId: string; name: string; age: number }) {
  const track = getTrack("save");
  const { data: events } = useProgress(childId);
  const done = track.sequence.filter((item) =>
    events?.some((e) => e.item_type === item.kind && e.item_id === item.id),
  ).length;
  const insights = buildInsights(track, events ?? []);

  return (
    <Card>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-muted-foreground">TATI Junior · age {age} · SAVE track</p>
        </div>
        <Link
          to="/learn/$childId"
          params={{ childId }}
          className="flex min-h-[48px] items-center rounded-2xl bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          Open
        </Link>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={done}
          max={track.sequence.length}
          label={`${done} of ${track.sequence.length} steps finished`}
        />
      </div>

      <ul className="mt-4 space-y-2">
        {insights.map((insight) => (
          <li key={insight} className="rounded-2xl bg-secondary px-4 py-3 text-sm text-secondary-foreground">
            {insight}
          </li>
        ))}
      </ul>
    </Card>
  );
}
