import type{ UIState } from "./uiState";
import type{ DijkstraStep } from "../../../shared/types";
import type { ProtocolStep } from "../../../shared/protocolTypes";
import { applyDijkstraStep } from "./reducers/dijkstraReducer";
import { applyProtocolStep } from "./reducers/protocolReducer";

export function applyStep(state: UIState, step: DijkstraStep | ProtocolStep): UIState {
  if ("type" in step && step.type === "SEND_VECTOR") {
    return applyProtocolStep(state, step as ProtocolStep);
  }
  return applyDijkstraStep(state, step as DijkstraStep);
}
