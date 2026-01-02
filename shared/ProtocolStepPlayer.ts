import { ProtocolStep } from "./protocolTypes";

export class ProtocolStepPlayer {
  private steps: ProtocolStep[] = [];
  private index = -1;

  constructor(private sessionId: string) {}

  async next(): Promise<ProtocolStep | null> {
    this.index++;

    if (this.index < this.steps.length) {
      return this.steps[this.index];
    }

    const res = await fetch("/api/protocol/next", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId: this.sessionId })
    });

    const data = await res.json();
    if (!data.step) return null;

    this.steps.push(data.step);
    return data.step;
  }

  prev(): ProtocolStep | null {
    if (this.index <= 0) return null;
    this.index--;
    return this.steps[this.index];
  }

  reset() {
    this.index = -1;
  }
}
