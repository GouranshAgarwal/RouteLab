import { ProtocolEngine } from "./ProtocolEngine";
import { Graph } from "../../../shared/types";
import { ProtocolStep } from "../../../shared/protocolTypes";
import { RouterNode } from "../protocols/core/RouterNode";

export class BellmanFordProtocolEngine implements ProtocolEngine {
  private nodes = new Map<string, RouterNode>();
  private converged = false;
  private steps: ProtocolStep[] = [];

  initialize(graph: Graph) {
    graph.forEach((edges, nodeId) => {
      const neighbors = edges.map(e => e.to);
      this.nodes.set(nodeId, new RouterNode(nodeId, neighbors));
    });
  }

  tick(): ProtocolStep[] {
    if (this.converged) return [];

    // Algorithm body intentionally omitted
    return [];
  }

  isConverged(): boolean {
    return this.converged;
  }

  getSteps(): ProtocolStep[] {
    return this.steps;
  }
}
