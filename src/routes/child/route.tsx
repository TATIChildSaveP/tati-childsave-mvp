import { createFileRoute, Outlet } from "@tanstack/react-router";
import { BottomNavigation } from "@/components/tati";

export const Route = createFileRoute("/child")({
  component: ChildLayout,
});

function ChildLayout() {
  return (
    <>
      <Outlet />
      <BottomNavigation />
    </>
  );
}
