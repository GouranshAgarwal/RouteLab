import type { UIState } from "../uiState";
import type { DijkstraStep } from "../../../../shared/types";

export function applyDijkstraStep(prev: UIState, step: DijkstraStep): UIState {
  const next = { ...prev, stepType: step.type, activeEdge: undefined };

  switch (step.type) {
    case "INIT":
      return {
        ...next,
        distances: new Map(step.distancesSnapshot),
        visited: new Set(),
        source: step.source,
      };

    case "PICK_NODE":
      return { ...next, activeNode: step.node };

    case "RELAX_EDGE":
      return { ...next, activeEdge: { from: step.from, to: step.to } };

    case "UPDATE_DISTANCE":
      const d = new Map(prev.distances);
      d.set(step.to, step.newDistance);
      return { ...next, distances: d };

    case "MARK_VISITED":
      const v = new Set(prev.visited);
      v.add(step.node);
      return { ...next, visited: v };

    default:
      return next;
  }
}
