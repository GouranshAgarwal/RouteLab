import type { NodeId } from "../../../shared/types";
import type { GraphLayout } from "./graphTypes";

export function createCircularLayout(
    nodes : Set<NodeId>,
    centerX = 400,
    centerY = 300,
    radius = 200
):GraphLayout{
    const layout:GraphLayout = new Map();
    const nodeArray = Array.from(nodes);
    const angleSteps = (2 * Math.PI)/nodeArray.length;
    nodeArray.forEach((nodeId, index) => {
        const angle = index * angleSteps;
        layout.set(nodeId, {
            x: centerX + radius * Math.cos(angle),
            y: centerY + radius * Math.sin(angle)
        })
    });

    return layout;
}