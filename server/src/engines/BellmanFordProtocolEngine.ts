import { ProtocolEngine } from "./ProtocolEngine";
import { Graph, NodeId } from "../../../shared/types";
import { ProtocolStep } from "../../../shared/protocolTypes";
import { RouterNode } from "../protocols/core/RouterNode";

export class BellmanFordProtocolEngine implements ProtocolEngine {
  routers = new Map<string, RouterNode>();
  private converged = false;
  private steps: ProtocolStep[] = [];
  private nodes = new Set<NodeId>();

  initialize(graph: Graph) {
  this.routers.clear();
  this.nodes.clear();

  // ---- PASS 1: Collect all nodes and create routers ----
  graph.forEach((edges, nodeId) => {
    this.nodes.add(nodeId);
    edges.forEach(e => this.nodes.add(e.to));
    const neighbors = edges.map(e => e.to);
    this.routers.set(nodeId, new RouterNode(nodeId, neighbors));
  });

  // ---- PASS 2: Initialize linkCost and routing tables ----
  graph.forEach((edges, nodeId) => {
    const router = this.routers.get(nodeId)!;

    router.linkCost = new Map(edges.map(e => [e.to, e.weight]));

    this.nodes.forEach(dest => {
      if (dest === nodeId) {
        router.table.set(dest, 0);
      } else if (router.linkCost.has(dest)) {
        router.table.set(dest, router.linkCost.get(dest)!);
      } else {
        router.table.set(dest, Infinity);
      }
    });
  });

  this.converged = false;
  this.steps = [];
}


  tick(): ProtocolStep[] {
    if (this.converged) return [];
    this.steps = [];

    //Phase 1: Each router sends its routing table to every neighbor (inbox)
    this.routers.forEach((sender)=>{
      sender.neighbors.forEach(receiverId=>{
        const receiver = this.routers.get(receiverId);
        if(!receiver)return;
        receiver.inbox.set(sender.id, new Map(sender.table));
        this.steps.push({
          type: "SEND_VECTOR",
          from: sender.id,
          vector: new Map(sender.table)
        });
      })
    })
    

    //Phase 2: Each router processes its inbox
    this.routers.forEach(router=>{
      router.inbox.forEach((vector, sender)=>{
        const cost_to_sender = router.linkCost.get(sender);
        if(cost_to_sender === undefined) return;

        this.steps.push({
          type: "RECEIVE_VECTOR",
          at: router.id,
          from: sender,
          vector: new Map(vector)
        });

        vector.forEach((dist, dest)=>{
          const currDist = router.table.get(dest);
          if(currDist === undefined) return;

          const newDist = cost_to_sender + dist;

          if(newDist < currDist){
            router.table.set(dest, newDist);
            router.changed = true;

            this.steps.push({
              type: "UPDATE_ROUTE",
              node: router.id,
              to: dest,
              oldDistance: currDist,
              newDistance: newDist
            })

          }
        })
      })
      router.inbox.clear();
    })

    //Phase 3: Check for convergence 
    let stable = true;
    this.routers.forEach(router=>{
      if(router.changed){
        stable = false;
      }
        router.changed = false; // reset for the next tick 
    })
    if(stable){
      this.converged = true;
      this.steps.push({
        type: "CONVERGED"
      })
    }
    
    return this.steps;
  }

  isConverged(): boolean {
    return this.converged;
  }

  getSteps(): ProtocolStep[] {
    return this.steps;
  }
}
