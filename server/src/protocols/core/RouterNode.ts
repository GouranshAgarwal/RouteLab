import { NodeId, DistMap } from "../../../../shared/types";

export class RouterNode {
  id: NodeId;
  neighbors: NodeId[];
  table: DistMap = new Map();
  inbox: Map<NodeId, DistMap> = new Map();
  changed: boolean = false;
  linkCost: Map<NodeId, number> = new Map();

  constructor(id: NodeId, neighbors: NodeId[]) {
    this.id = id;
    this.neighbors = neighbors;
  }
}
