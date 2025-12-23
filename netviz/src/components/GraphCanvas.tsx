// import React from "react";
// import type { LayerProps } from "../graph/graphTypes";
// import NodeLayer from "./NodeLayer";
// import EdgeLayer from "./EdgeLayer";
// import type { NodeId } from "../../../shared/types";

// type GraphCanvasProps = LayerProps & {
//     selectedNode?: string | null;   
//     shortestPath?: NodeId[] | null;
//     onNodeClick?: (nodeId: string) => void;
// };

// const GraphCanvas : React.FC<GraphCanvasProps>= ({
//     graphState,
//     layout,
//     uiState,
//     selectedNode,
//     shortestPath,
//     onNodeClick
// }) => {
//   return (
//     <svg width={800} height={600} style={{ border: "1px solid #ccc" }}>
//         <EdgeLayer graphState={graphState} layout={layout} uiState={uiState} shortestPath={shortestPath}/>
//         <NodeLayer graphState={graphState} layout={layout} uiState={uiState} shortestPath={shortestPath} selectedNode={selectedNode} onNodeClick={onNodeClick}/>
//     </svg>
//   )
// }

// export default GraphCanvas

import React, { useRef, useState } from "react";
import type { LayerProps } from "../graph/graphTypes";
import NodeLayer from "./NodeLayer";
import EdgeLayer from "./EdgeLayer";
import type { NodeId } from "../../../shared/types";

type GraphCanvasProps = LayerProps & {
  selectedNode?: string | null;
  shortestPath?: NodeId[] | null;
  onNodeClick?: (nodeId: string) => void;
};

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphState,
  layout,
  uiState,
  selectedNode,
  shortestPath,
  onNodeClick,
}) => {
  /* ================= CAMERA STATE ================= */
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  /* ================= PAN HANDLERS ================= */
  const onMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsPanning(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const onMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isPanning || !lastPos.current) return;

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;

    setOffset(prev => ({
      x: prev.x + dx,
      y: prev.y + dy,
    }));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const stopPanning = () => {
    setIsPanning(false);
    lastPos.current = null;
  };

  /* ================= ZOOM HANDLER ================= */
  const onWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    const zoomSpeed = 0.001;
    const newScale = Math.min(
      3,
      Math.max(0.2, scale - e.deltaY * zoomSpeed)
    );

    setScale(newScale);
  };

  /* ================= OPTIONAL: RESET VIEW ================= */
  const resetView = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  /* ================= RENDER ================= */
  return (
    <div style={{ position: "relative" }}>
      {/* Reset Button */}
      <button
        onClick={resetView}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          zIndex: 10,
          padding: "4px 8px",
          fontSize: "12px",
        }}
      >
        Reset View
      </button>

      <svg
        width={800}
        height={600}
        style={{
          border: "1px solid #ccc",
          cursor: isPanning ? "grabbing" : "grab",
          // background: "#fff",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopPanning}
        onMouseLeave={stopPanning}
        onWheel={onWheel}
      >
        {/* CAMERA TRANSFORM */}
        <g transform={`translate(${offset.x}, ${offset.y}) scale(${scale})`}>
          <EdgeLayer
            graphState={graphState}
            layout={layout}
            uiState={uiState}
            shortestPath={shortestPath}
          />
          <NodeLayer
            graphState={graphState}
            layout={layout}
            uiState={uiState}
            shortestPath={shortestPath}
            selectedNode={selectedNode}
            onNodeClick={onNodeClick}
          />
        </g>
      </svg>
    </div>
  );
};

export default GraphCanvas;
