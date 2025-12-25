import { Graph } from "../../../shared/types";
import {ProtocolStep} from "../../../shared/protocolTypes"

export interface ProtocolEngine {
  initialize(graph: Graph): void;
  tick(): ProtocolStep[];
  isConverged(): boolean;
  getSteps(): ProtocolStep[];
}
