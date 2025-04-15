import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

function Index() {
  return <h3>Welcome Home!</h3>;
}
