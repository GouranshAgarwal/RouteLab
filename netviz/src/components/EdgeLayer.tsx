import React from 'react'
import type { LayerProps } from '../graph/graphTypes'

type EdgeLayerProps = LayerProps & {
    shortestPath?: string[] | null;
}
const EdgeLayer: React.FC<EdgeLayerProps> = ({
    graphState,
    layout,
    uiState,
    shortestPath
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
                
                const isOnPath = shortestPath && shortestPath.findIndex(e=>e===from)+1 === shortestPath.findIndex(e=>e===edge.to);
                const isNotOnPath = shortestPath && 1;
                return (
                    <>
                    <line
                        key={`${from}-${edge.to}`}
                        x1={fromPos.x}
                        x2={toPos.x}
                        y1={fromPos.y}
                        y2={toPos.y}
                        stroke={(isActive || isOnPath) ? "#22d3ee" : isNotOnPath?"#ff4e5fff": "#6b7280"}
                        strokeWidth={(isActive || isOnPath) ? 4 : 2}
                    />
                    <text
                        x={textPosX}
                        y={textPosY}
                        textAnchor="middle" 
                        className="
                            fill-gray-900 
                            dark:fill-gray-100
                            text-sm
                            font-mono
                        "
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