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

export function createPhyllotaxisLayout(
  nodes: Set<NodeId>,
  centerX = 400,
  centerY = 300,
  nodeRadius = 50,
  labelPadding = 10
): GraphLayout {
  const layout: GraphLayout = new Map();
  const nodeArray = Array.from(nodes);

  // Minimum center-to-center distance
  const minSpacing = 2 * nodeRadius + labelPadding;

  const goldenAngle = Math.PI * (3 - Math.sqrt(5)); // ~137.5°

  nodeArray.forEach((nodeId, i) => {
    const radius = minSpacing * Math.sqrt(i);
    const angle = i * goldenAngle;

    layout.set(nodeId, {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    });
  });

  return layout;
}

export function createRadialDistanceLayout(
  nodes: Set<NodeId>,
  distances: Map<NodeId, number>,
  centerX = 400,
  centerY = 300,
  ringSpacing = 80
): GraphLayout {
  const layout: GraphLayout = new Map();
  const layers = new Map<number, NodeId[]>();

  nodes.forEach(node => {
    const d = distances.get(node) ?? Infinity;
    if (!layers.has(d)) layers.set(d, []);
    layers.get(d)!.push(node);
  });

  Array.from(layers.entries()).forEach(([dist, layerNodes]) => {
    const radius = dist * ringSpacing;
    const angleStep = (2 * Math.PI) / layerNodes.length;

    layerNodes.forEach((node, i) => {
      const angle = i * angleStep;
      layout.set(node, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    });
  });

  jitterIfTooClose(layout);
  return layout;
}

export function jitterIfTooClose(
  layout: GraphLayout,
  minDist = 25
) {
  const nodes = Array.from(layout.entries());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i][1];
      const b = nodes[j][1];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);

      if (dist < minDist) {
        const push = (minDist - dist) / 2;
        const angle = Math.random() * 2 * Math.PI;
        a.x += Math.cos(angle) * push;
        a.y += Math.sin(angle) * push;
        b.x -= Math.cos(angle) * push;
        b.y -= Math.sin(angle) * push;
      }
    }
  }
}
