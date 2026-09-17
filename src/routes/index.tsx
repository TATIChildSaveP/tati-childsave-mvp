import { createFileRoute, Link } from "@tanstack/react-router";
import { Screen, Card, PrimaryButton } from "@/components/learning/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TATI ChildSave — money skills for African children" },
      {
        name: "description",
        content:
          "TATI ChildSave helps Ghanaian children aged 8–12 learn to save through stories, decisions and real-life money choices.",
      },
      { property: "og:title", content: "TATI ChildSave — money skills for African children" },
      {
        property: "og:description",
        content:
          "Fun, warm lessons and decision stories that build financially smart, life-ready children.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <Screen>
      <div className="pt-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">TATI ChildSave</p>
        <h1 className="mt-3 text-4xl font-bold leading-tight">
          Building Africa's next generation of financially smart children.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          TATI Junior teaches children aged 8–12 how money really works — through Ghanaian stories,
          real decisions and the consequences that follow.
        </p>

        <div className="mt-8 space-y-3">
          <Link to="/auth">
            <PrimaryButton>Create a parent account</PrimaryButton>
          </Link>
          <Link
            to="/auth"
            className="flex min-h-[48px] items-center justify-center rounded-2xl border border-border bg-card text-base font-semibold"
          >
            I already have an account
          </Link>
        </div>

        <div className="mt-10 grid gap-4">
          <Card>
            <h2 className="text-lg font-bold">Learn by deciding</h2>
            <p className="mt-1 text-muted-foreground">
              Children choose, see what happens, and adjust their plan — never shamed for a choice.
            </p>
          </Card>
          <Card>
            <h2 className="text-lg font-bold">The SAVE track</h2>
            <p className="mt-1 text-muted-foreground">
              A check-in, three lessons, two decision stories and a final check-in, all in cedis.
            </p>
          </Card>
          <Card>
            <h2 className="text-lg font-bold">Parents can follow along</h2>
            <p className="mt-1 text-muted-foreground">
              See progress, choices made and what your child is ready to talk about at home.
            </p>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
