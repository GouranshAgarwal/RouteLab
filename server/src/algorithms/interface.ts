import { DistMap, ParentMap, AlgorithmInput, DijkstraStep } from "../../../shared/types";

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