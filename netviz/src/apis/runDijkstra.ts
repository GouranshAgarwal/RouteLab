import type { AlgorithmInput, DijkstraStep, DistMap, ParentMap } from "../../../shared/types";

export async function runDijkstraAPI(
  input: AlgorithmInput
) {
  const res = await fetch("http://localhost:3001/api/run/dijkstra", {
    method: "POST",
    headers: { "Content-Type": "application/json" },

    // 🔥 Convert Map → Object ONCE here
    body: JSON.stringify({
      source: input.source,
      graph: Object.fromEntries(input.graph),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  const data = await res.json();

  const steps = data.steps.map((step: any) => {
    if (step.type === "INIT") {
      return {
        ...step,
        distancesSnapshot: new Map(Object.entries(step.distancesSnapshot)),
      };
    }
    return step;
  });

  return {
    steps,
    parents: new Map(Object.entries(data.parents)),
    distances: new Map(Object.entries(data.distances)),
  } as {
    steps: DijkstraStep[];
    parents: ParentMap;
    distances: DistMap;
  };
}
