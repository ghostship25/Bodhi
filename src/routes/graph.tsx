import { createFileRoute } from "@tanstack/react-router";
import { GraphView } from "@/components/bodhi/graph-view";

export const Route = createFileRoute("/graph")({
  component: GraphPage,
});

function GraphPage() {
  return <GraphView />;
}
