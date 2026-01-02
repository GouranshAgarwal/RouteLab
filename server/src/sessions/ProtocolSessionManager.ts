import { BellmanFordProtocolEngine } from "../engines/BellmanFordProtocolEngine";
import { Graph } from "../../../shared/types";

const sessions = new Map<string, BellmanFordProtocolEngine>();

export function createSession(graph: Graph): string {
  const id = crypto.randomUUID();
  const engine = new BellmanFordProtocolEngine();
  engine.initialize(graph);
  sessions.set(id, engine);
  return id;
}

export function getSession(id: string) {
  return sessions.get(id);
}
