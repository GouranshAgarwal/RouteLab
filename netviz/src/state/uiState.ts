import type {DijkstraStep, NodeId } from "../../../shared/types";

type UIState = {
    stepType?: DijkstraStep["type"];
    source?:NodeId;
    activeNode?: NodeId;
    activeEdge?: {from:NodeId, to:NodeId};
    visited: Set<NodeId>;
    distances: Map<NodeId, number>;
}

function createInitialUIState():UIState{
    return {
        stepType:undefined,
        activeNode:undefined,
        activeEdge:undefined,
        source:undefined,
        visited: new Set(),
        distances: new Map(),
    }
}

function applyStep(prevState: UIState, step: DijkstraStep):UIState{
    const next : UIState = {
        ...prevState,
        stepType: step.type,
        activeEdge: undefined,
    }

    switch (step.type) {
        case "INIT":
            return{
                ...next,
                distances:  new Map(step.distancesSnapshot),
                source: step.source
            }
        case "PICK_NODE":
            return {
                ...next,
                activeNode: step.node
            }
        case "RELAX_EDGE":
            return {
                ...next,
                activeEdge: {from: step.from, to: step.to}
            }
        case "UPDATE_DISTANCE":
            const distances = new Map(prevState.distances);
            distances.set(step.to, step.newDistance);
            return {
                ...next,
                distances
            }

        case "MARK_VISITED":
            const visited = new Set(prevState.visited);
            visited.add(step.node);
            return {
                ...next,
                visited
            }
        case "DONE":
            return next;
            
        default:
            return next;
    }
}

export {createInitialUIState, applyStep}
export type {UIState};