import type { UIState } from "../uiState";
import type { ProtocolStep } from "../../../../shared/protocolTypes";

export function applyProtocolStep(prev: UIState, step: ProtocolStep): UIState {
  const next = { ...prev, stepType: step.type };

  switch (step.type) {
    case "UPDATE_ROUTE":
      const d = new Map(prev.distances);
      d.set(step.to, step.newDistance);
      return { ...next, distances: d };

    case "CONVERGED":
      return next;

    default:
      return next;
  }
}
