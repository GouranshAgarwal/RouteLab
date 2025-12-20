import React from 'react'
import type { LayerProps } from '../graph/graphTypes'
import type { NodeId } from '../../../shared/types'

type NodeLayerProps = LayerProps & {
    selectedNode?: NodeId | null;
    onNodeClick?: (nodeId: NodeId) => void;
}

const NodeLayer : React.FC<NodeLayerProps> = ({
    graphState,
    layout,
    uiState,
    selectedNode,
    onNodeClick
}) => {
    const activeNode = uiState?.activeNode;
  return (
    <>
        {[...graphState.nodes].map( nodeId=>{
            const pos = layout.get(nodeId);
            if(!pos)return null;
            const isActive = activeNode && activeNode === nodeId;
            const isVisited = uiState?.visited.has(nodeId);
            const isSelected = selectedNode === nodeId;

            return (
                <g key={nodeId}>
                    <circle
                        cx={pos.x}
                        cy={pos.y}
                        r={22}
                        fill={
                            isSelected
                            ? "facc15"
                            :isVisited
                            ? "#6b7280"
                            : isActive
                            ? "#22d3ee"
                            : "#3b82f6"
                        }
                        onClick={()=>onNodeClick?.(nodeId)}
                        style={{cursor : "pointer"}}
                    />
                    <text
                        x={pos.x}
                        y={pos.y+5}
                        textAnchor="middle"
                        fill="white"
                        fontSize={14}
                    >
                        {nodeId}
                    </text>
                </g>
            )
        })}
    </>
    
  )
}

export default NodeLayer