import { NodeId, DistMap } from "./types";

export type SendVectorStep = {
  type: "SEND_VECTOR";
  from: NodeId;
  vector: DistMap;
};

export type ReceiveVectorStep = {
  type: "RECEIVE_VECTOR";
  at: NodeId;
  from: NodeId;
  vector: DistMap;
};

export type UpdateRouteStep = {
  type: "UPDATE_ROUTE";
  node: NodeId;
  to: NodeId;
  oldDistance: number;
  newDistance: number;
};

export type ConvergedStep = {
  type: "CONVERGED";
};

export type ProtocolStep =
  | SendVectorStep
  | ReceiveVectorStep
  | UpdateRouteStep
  | ConvergedStep;
