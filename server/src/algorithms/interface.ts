import { DistMap, ParentMap, AlgorithmInput, DijkstraStep } from "./ts/types";

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