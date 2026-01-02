import { Router } from "express";
import { createSession, getSession } from "../src/sessions/ProtocolSessionManager";


const router = Router();

router.post("/start", (req, res) => {
  const sessionId = createSession(req.body.graph);
  res.json({ sessionId });
});

router.post("/next", (req, res) => {
  const engine = getSession(req.body.sessionId);
  if (!engine) return res.status(404).json({ error: "Session not found" });

  const steps = engine.tick();
  res.json({ step: steps.shift() ?? null });
});

export default router;
