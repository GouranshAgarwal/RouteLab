import { AlgorithmEngine } from "./AlgorithmEngine";
import { Dijkstra } from "../algorithms/ts/dijkstra";
import { AlgorithmInput } from "../../../shared/types";
import { AlgorithmResult } from "../algorithms/interface";

export class DijkstraEngine implements AlgorithmEngine {
  run(input: AlgorithmInput) : AlgorithmResult{
    return new Dijkstra().run(input);
  }
}
