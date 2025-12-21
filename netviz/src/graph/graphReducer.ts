import type { NodeId } from "../../../shared/types";
import type { GraphState } from "./graphState";

type GraphAction =
  | { type: "ADD_NODE"; nodeId: NodeId }
  | { type: "REMOVE_NODE"; nodeId: NodeId }
  | { type: "ADD_EDGE"; from: NodeId; to: NodeId; weight: number, directed: boolean}
  | { type: "REMOVE_EDGE"; from: NodeId; to: NodeId };


function GraphReducer(
  prevState: GraphState,
  action: GraphAction
): GraphState {
  switch (action.type) {

    case "ADD_NODE": {
      const nodes = new Set(prevState.nodes);
      const edges = new Map(prevState.edges);

      nodes.add(action.nodeId);
      edges.set(action.nodeId, []);

      return { nodes, edges };
    }

    case "REMOVE_NODE": {
      const nodes = new Set(prevState.nodes);
      const edges = new Map(prevState.edges);

      nodes.delete(action.nodeId);
      edges.delete(action.nodeId);

      // Remove incoming edges
      for (const [from, edgeList] of edges.entries()) {
        edges.set(
          from,
          edgeList.filter(edge => edge.to !== action.nodeId)
        );
      }

      return { nodes, edges };
    }

    case "ADD_EDGE": {
      const edges = new Map(prevState.edges);

      const addEdge = (from: NodeId, to: NodeId, weight: number) => {
        const list = edges.get(from) ?? [];

        const idx = list.findIndex(e => e.to === to);
        if (idx >= 0) {
          list[idx].weight = weight;
        } else {
          list.push({ to, weight });
        }
      };

      addEdge(action.from, action.to, action.weight);
      if(!action.directed){
        addEdge(action.to, action.from, action.weight);
      }
      return { ...prevState, edges };
    }

    case "REMOVE_EDGE": {
      const edges = new Map(prevState.edges);

      const prevEdges = edges.get(action.from);
      if (!prevEdges) return prevState;

      const newEdges = prevEdges.filter(
        edge => edge.to !== action.to
      );

      edges.set(action.from, newEdges);

      return {
        ...prevState,
        edges
      };
    }

    default:
      return prevState;
  }
}

export { GraphReducer };
