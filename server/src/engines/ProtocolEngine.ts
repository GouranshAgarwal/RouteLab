import { Graph, NodeId } from "../../../shared/types";
import {ProtocolStep} from "../../../shared/protocolTypes"
import { RouterNode } from "../protocols/core/RouterNode";

export interface ProtocolEngine {
  routers: Map<NodeId, RouterNode>;
  initialize(graph: Graph): void;
  tick(): ProtocolStep[];
  isConverged(): boolean;
  getSteps(): ProtocolStep[];
}
