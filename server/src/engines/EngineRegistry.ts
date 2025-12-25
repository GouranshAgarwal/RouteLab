import { DijkstraEngine } from "./DijkstraEngine";
import { BellmanFordAlgorithmEngine } from "./BellmanFordEngine";
import { BellmanFordProtocolEngine } from "./BellmanFordProtocolEngine";
import { AlgorithmEngine } from "./AlgorithmEngine";
import { ProtocolEngine } from "./ProtocolEngine";

export function getAlgorithmEngine(type: string): AlgorithmEngine {
  switch (type) {
    case "dijkstra":
      return new DijkstraEngine();
    case "bellman-ford":
      return new BellmanFordAlgorithmEngine();
    default:
      throw new Error("Unknown algorithm engine");
  }
}

export function getProtocolEngine(type: string): ProtocolEngine {
  switch (type) {
    case "bellman-ford":
      return new BellmanFordProtocolEngine();
    default:
      throw new Error("Unknown protocol engine");
  }
}
