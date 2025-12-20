import type { NodeId } from "../../../shared/types";
import type { GraphState } from "./graphState";

type GraphAction =
  | { type: "ADD_NODE"; nodeId: NodeId }
  | { type: "REMOVE_NODE"; nodeId: NodeId }
  | { type: "ADD_EDGE"; from: NodeId; to: NodeId; weight: number }
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

      const prevEdges = edges.get(action.from) ?? [];
      const newEdges = [...prevEdges, { to: action.to, weight: action.weight }];

      edges.set(action.from, newEdges);

      return {
        ...prevState,
        edges
      };
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
