import { Router } from "express";
import { Dijkstra } from "../src/algorithms/ts";
import { AlgorithmInput, Graph } from "../../shared/types";
import { AlgorithmResult } from "../src/algorithms/interface";

const router = Router();
router.post("/dijkstra", (req, res) => {
  try {
    console.log("Received Dijkstra request with body:", req.body);

    const { graph, source } = req.body;

    if (!graph || !source) {
      return res.status(400).json({ error: "Invalid input" });
    }

    // 🔥 graph is a plain object here
    // Convert Object → Map exactly once
    const graphMap = new Map(Object.entries(graph));

    const input: AlgorithmInput = {
      graph: graphMap as Graph,
      source,
    };

    const result = new Dijkstra().run(input);

    // 🔥 Convert Maps → Objects for JSON
    res.json({
      steps: result.steps,
      parents: Object.fromEntries(result.parents),
      distances: Object.fromEntries(result.distances),
    });
  } catch (err: any) {
    console.error("Dijkstra API error:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;