import React from "react";
import type { LayerProps } from "../graph/graphTypes";
import NodeLayer from "./NodeLayer";
import EdgeLayer from "./EdgeLayer";
import type { NodeId } from "../../../shared/types";

type GraphCanvasProps = LayerProps & {
    selectedNode?: string | null;   
    shortestPath?: NodeId[] | null;
    onNodeClick?: (nodeId: string) => void;
};

const GraphCanvas : React.FC<GraphCanvasProps>= ({
    graphState,
    layout,
    uiState,
    selectedNode,
    shortestPath,
    onNodeClick
}) => {
  return (
    <svg width={800} height={600} style={{ border: "1px solid #ccc" }}>
        <EdgeLayer graphState={graphState} layout={layout} uiState={uiState} shortestPath={shortestPath}/>
        <NodeLayer graphState={graphState} layout={layout} uiState={uiState} shortestPath={shortestPath} selectedNode={selectedNode} onNodeClick={onNodeClick}/>
    </svg>
  )
}

export default GraphCanvas