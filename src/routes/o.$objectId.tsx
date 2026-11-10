import { createFileRoute } from "@tanstack/react-router";
import { ObjectView } from "@/components/bodhi/object-view";

export const Route = createFileRoute("/o/$objectId")({
  component: ObjectRoute,
});

function ObjectRoute() {
  const { objectId } = Route.useParams();
  return <ObjectView objectId={objectId} />;
}
