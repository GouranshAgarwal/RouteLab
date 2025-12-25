import { DistMap, ParentMap, AlgorithmInput, DijkstraStep } from "../../../shared/types";

type AlgorithmResult = {
    distances: DistMap;
    parents: ParentMap;
    steps: DijkstraStep[];
}

// interface RoutingAlgorithm { // same as algorithm engin--to be deleted later
//     run(input: AlgorithmInput): AlgorithmResult;
// }

export {
    //RoutingAlgorithm,
    AlgorithmResult
}