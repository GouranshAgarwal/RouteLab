type NodeId =  string;

type Edge = {
    to: NodeId;
    weight: number; 
}

type HeapNode = {
    nodeId: NodeId;
    distance: number;
};

type Graph = Map<NodeId, Edge[]>;

type AlgorithmInput = {
    graph: Graph;
    source: NodeId;
}

type DistMap = Map<NodeId, number>;
type ParentMap = Map<NodeId, NodeId | null>;

type InitStep = {
    type: "INIT";
    source: NodeId;
    distancesSnapshot: DistMap; 
} 

type PickNodeStep = {
    type: "PICK_NODE";
    node: NodeId;
    distance: number;
}

type RelaxEdgeStep = {
    type: "RELAX_EDGE",
    from: NodeId;
    to: NodeId;
    currentDistance: number;
    edgeWeight: number;
}

type UpdateDistanceStep = {
    type: "UPDATE_DISTANCE";
    from: NodeId;
    to: NodeId;
    oldDistance: number;
    newDistance: number;
}

type MarkVisitedStep = {
    type:"MARK_VISITED";
    node: NodeId;
}

type DoneStep = {
    type:"DONE";
}

type DijkstraStep =
  | InitStep
  | PickNodeStep
  | RelaxEdgeStep
  | UpdateDistanceStep
  | MarkVisitedStep
  | DoneStep;




export {
    Edge, 
    Graph,
    AlgorithmInput,
    DistMap,
    ParentMap,
    NodeId,
    HeapNode,
    DijkstraStep,
};