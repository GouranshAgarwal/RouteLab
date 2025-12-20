import type { Graph } from "../../../shared/types";
import type { GraphState } from "../graph/graphState";

export function graphStateToGraph(graphState: GraphState):Graph{
    return new Map(graphState.edges);
}