import type { NodeId } from "../../../shared/types";
import type { UIState } from "../state/uiState";
import type { GraphState } from "./graphState";

type NodePosition = {
    x : number;
    y : number;
}

type GraphLayout = Map<NodeId, NodePosition>;

type LayerProps = {
    graphState: GraphState;
    layout: GraphLayout;
    uiState?: UIState;
}

export type{
    NodePosition,
    GraphLayout,
    LayerProps,
}