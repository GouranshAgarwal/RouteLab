import React from "react";
import type { LayerProps } from "../graph/graphTypes";
import NodeLayer from "./NodeLayer";
import EdgeLayer from "./EdgeLayer";

type GraphCanvasProps = LayerProps & {
    selectedNode?: string | null;   
    onNodeClick?: (nodeId: string) => void;
};

const GraphCanvas : React.FC<GraphCanvasProps>= ({
    graphState,
    layout,
    uiState,
    selectedNode,
    onNodeClick
}) => {
  return (
    <svg width={800} height={600} style={{ border: "1px solid #ccc" }}>
        <EdgeLayer graphState={graphState} layout={layout} uiState={uiState}/>
        <NodeLayer graphState={graphState} layout={layout} uiState={uiState} selectedNode={selectedNode} onNodeClick={onNodeClick}/>
    </svg>
  )
}

export default GraphCanvas