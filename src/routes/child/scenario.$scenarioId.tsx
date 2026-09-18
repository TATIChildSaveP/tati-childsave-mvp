import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Page,
  PageHeader,
  Card,
  CardTitle,
  Button,
  Badge,
  StatCard,
  Modal,
  EmptyState,
  ProgressBar,
} from "@/components/tati";
import { mockScenarios } from "@/content/mock";

export const Route = createFileRoute("/child/scenario/$scenarioId")({
  head: () => ({
    meta: [
      { title: "Decision story — TATI ChildSave" },
      {
        name: "description",
        content: "Make money choices in a Ghanaian story and see what happens next.",
      },
      { property: "og:title", content: "Decision story — TATI ChildSave" },
      { property: "og:description", content: "Choose, see the result, and adjust your plan." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScenarioPage,
});

function ScenarioPage() {
  const { scenarioId } = Route.useParams();
  const scenario = mockScenarios.find((s) => s.id === scenarioId);
  const [showHelp, setShowHelp] = useState(false);

  if (!scenario) {
    return (
      <Page withBottomNav>
        <PageHeader backTo="/child/learn" title="Decision story" />
        <EmptyState
          title="This story isn't open yet"
          description="Finish the mission you're on and this one will unlock."
          action={<Button to="/child/learn">Back to my journey</Button>}
        />
      </Page>
    );
  }

  return (
    <Page withBottomNav>
      <PageHeader backTo="/child/learn" eyebrow="Track: SAVE" title={scenario.title} listenable />

      <Card tone="primary">
        <Badge tone="success" solid icon="⏱">
          {scenario.days} simulated days
        </Badge>
        <p className="mt-3 text-base">{scenario.description}</p>
        <div className="mt-4">
          <ProgressBar value={0} max={scenario.target} label="Day 1 of the mission" />
        </div>
      </Card>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <StatCard label="In pocket" money={scenario.pocket} tone="primary" icon="💰" />
        <StatCard label="Goal" money={scenario.target} tone="success" icon="🎯" />
      </div>

      <Card className="mt-4">
        <CardTitle>What happens here</CardTitle>
        <p className="mt-1 text-base text-muted-foreground">
          You'll meet a situation, choose what to do with your money, and see the result straight
          away. Interesting choice or careful choice — every decision teaches you something.
        </p>
      </Card>

      <div className="mt-6 space-y-3">
        <Button to="/child/results" size="lg" variant="success">
          Let's Start →
        </Button>
        <Button variant="secondary" onClick={() => setShowHelp(true)}>
          How does this work?
        </Button>
      </div>

      <Modal
        open={showHelp}
        onClose={() => setShowHelp(false)}
        title="How decision stories work"
        footer={<Button onClick={() => setShowHelp(false)}>Got it</Button>}
      >
        <p>
          Read the situation, pick what you would really do, then see what happens to your money. You
          can always adjust your plan and keep going.
        </p>
      </Modal>
    </Page>
  );
}
