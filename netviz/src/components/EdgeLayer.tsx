import React from 'react'
import type { LayerProps } from '../graph/graphTypes'


const EdgeLayer: React.FC<LayerProps> = ({
    graphState,
    layout,
    uiState
}) => {
    const activeEdge = uiState?.activeEdge;
  return (
    <>
        {[...graphState.edges.entries()].map(([from, edgeList])=>{
            const fromPos = layout.get(from);
            if(!fromPos) return null;

            return edgeList.map(edge=>{
                const toPos = layout.get(edge.to);
                if(!toPos)return null;

                const isActive = activeEdge && activeEdge.from === from && activeEdge.to === edge.to;
                const textPosX = (fromPos.x + toPos.x) / 2;
                const textPosY = (fromPos.y + toPos.y) / 2 - 5;
                return (
                    <>
                    <line
                        key={`${from}-${edge.to}`}
                        x1={fromPos.x}
                        x2={toPos.x}
                        y1={fromPos.y}
                        y2={toPos.y}
                        stroke={isActive ? "#22d3ee" : "#6b7280"}
                        strokeWidth={isActive ? 4 : 2}
                    />
                    <text
                        x={textPosX}
                        y={textPosY}
                        textAnchor="middle" 
                        fill="black"
                        fontSize={12}
                    >
                        {edge.weight}
                    </text>
                    </>
                )
            })
        })}
    </>
  )
}

export default EdgeLayer