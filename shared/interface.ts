import { DistMap, ParentMap, AlgorithmInput, DijkstraStep } from "./types";

type AlgorithmResult = {
    distances: DistMap;
    parents: ParentMap;
    steps: DijkstraStep[];
}

interface RoutingAlgorithm {
    run(input: AlgorithmInput): AlgorithmResult;
}

export {
    RoutingAlgorithm,
    AlgorithmResult
}