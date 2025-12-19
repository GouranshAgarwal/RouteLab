import { Dijkstra } from "./src/algorithms/ts/index";
import { StepPlayer } from "./src/controllers/StepPlayer";
import { reconstructPath } from "./src/utils/ReconstructPath";

// const graph = new Map([
//   ["A", []]
// ]);
// const graph = new Map([
//   ["A", [{ to: "B", weight: 1 }]],
//   ["B", [{ to: "C", weight: 2 }]],
//   ["C", [{ to: "D", weight: 3 }]],
//   ["D", []]
// ]);

// const graph = new Map([
//   ["A", [
//     { to: "B", weight: 4 },
//     { to: "C", weight: 2 }
//   ]],
//   ["B", [{ to: "D", weight: 1 }]],
//   ["C", [{ to: "D", weight: 5 }]],
//   ["D", []]
// ]);
// const graph = new Map([
//   ["A", [
//     { to: "B", weight: 10 },
//     { to: "C", weight: 1 }
//   ]],
//   ["C", [{ to: "B", weight: 1 }]],
//   ["B", []]
// ]);
const graph = new Map([
  ["A", [
    { to: "B", weight: 1 },
    { to: "C", weight: 4 }
  ]],
  ["B", [
    { to: "C", weight: 3 },
    { to: "D", weight: 2 }
  ]],
  ["C", [{ to: "D", weight: 1 }]],
  ["D", []]
]);

const source = "A";




const input = {graph, source};
const result = new Dijkstra().run(input);
const player = new StepPlayer(result.steps);
if(player.current()){
    console.log(player.current());
}
while(player.hasNext()){
    console.log(player.next());
}
console.log(reconstructPath(result.parents, source, "D"));