import React, { useEffect, useReducer, useState } from "react";
import GraphCanvas from "../components/GraphCanvas";
import { createCircularLayout } from "../graph/createCircularLayout";
import type { GraphState } from "../graph/graphState";
import { GraphReducer } from "../graph/graphReducer";
import type { DijkstraStep, NodeId } from "../../../shared/types";
import { applyStep, createInitialUIState } from "../state/uiState";
import {StepPlayer} from "../../../shared/StepPlayer"
import { graphStateToGraph } from "../algorithms/graphConverter";
import {Dijkstra} from "../../../shared/dijkstra"

const initialGraphState : GraphState = {
    nodes : new Set(),
    edges: new Map(),
}

const Playground: React.FC = () => {
  const [graphState, dispatch] = useReducer(GraphReducer, initialGraphState);
  const [selectedNode, setSelectedNode] = useState<NodeId | null>(null);
  const [nodeCounter, setNodeCounter] = useState(0);
  const [uiState, setUIState] = useState(createInitialUIState());
  const [stepPlayer, setStepPlayer] = useState<StepPlayer | null>(null);
  const [source, setSource] = useState<NodeId|null>(null);
  const layout = createCircularLayout(graphState.nodes);
  const handleNodeClick = (nodeId: NodeId)=>{
    if(!selectedNode){
        setSelectedNode(nodeId);
        return;
    }

    if(selectedNode === nodeId){
        setSelectedNode(null);
        return;
    }

    const input = prompt("Enter edge weight", "1");
    const weight = Number(input);

    if (!Number.isFinite(weight) || weight <= 0) {
        alert("Please enter a valid positive number");
        return;
    }

    dispatch({
        type: "ADD_EDGE",
        from: selectedNode,
        to: nodeId,
        weight: weight,
    });
    setSelectedNode(null);  
  }

  const handleNodeDelete = ()=>{
    if(!selectedNode)return;
    
    dispatch({
        type:"REMOVE_NODE",
        nodeId: selectedNode,
    })
    
    if(selectedNode === source){
        setSource(null);
    }
    setSelectedNode(null);
    return;
  }

  const handleAddNode = () => {
    const nodeId = nodeCounter < 26 ?String.fromCharCode(65 + nodeCounter) : `N${nodeCounter - 26}`;

    dispatch({
        type: "ADD_NODE",
        nodeId,
    });

    setNodeCounter(prev => prev + 1);
  };

  const handleAlgorithStart = ()=>{
    if(!source){
        alert("Please select a source node.");
        return;
    }
    const graph = graphStateToGraph(graphState);
    const input = {graph, source}
    const result = new Dijkstra().run(input);
    const player = new StepPlayer(result.steps);
    console.log(result);
    setStepPlayer(player);
    setUIState(createInitialUIState());
  }

  const handlePlay = ()=>{
    if (!stepPlayer) return;

    const step = stepPlayer.next();
    if (!step) return;

    setUIState(prev => applyStep(prev, step));
    console.log(step);
  }

  const handleSelectSource = ()=>{
    if(selectedNode){
        setSource(selectedNode);
        setSelectedNode(null);
    }
    console.log("source Selected: ", source);
    return;
  }

  useEffect(()=>{
    setStepPlayer(null);
    setUIState(createInitialUIState());
  },[graphState]);

  useEffect(()=>{
    if(source && !graphState.nodes.has(source)){
        setSource(null);
    }
  },[source, graphState.nodes]);

  return (
    <div>
        <GraphCanvas graphState={graphState} layout={layout} uiState={uiState} selectedNode={selectedNode} onNodeClick={handleNodeClick}/>
        <button
        onClick={handleAddNode}
        >
            Add Node
        </button>
        <button onClick={handleNodeDelete}>Delete Node</button>
        <button onClick={handleAlgorithStart}>Run Dijkstra</button>
        <button onClick={handlePlay} disabled={!stepPlayer?.hasNext()}>Next Step</button>
        <button onClick={handleSelectSource}>Select Source</button>
    </div>
  );
};

export default Playground;
