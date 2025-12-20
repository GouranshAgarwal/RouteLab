import type { Edge, NodeId } from "../../../shared/types";

type GraphState ={
    nodes:Set<NodeId>;
    edges: Map<NodeId, Edge[]>;
}

export type {
    GraphState,
}