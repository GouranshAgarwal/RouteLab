import React, { useCallback, useEffect, useReducer, useState } from "react";
import GraphCanvas from "../components/GraphCanvas";
import { createPhyllotaxisLayout } from "../graph/createCircularLayout";
import type { GraphState } from "../graph/graphState";
import { GraphReducer } from "../graph/graphReducer";
import type { NodeId, ParentMap } from "../../../shared/types";
import { createInitialUIState } from "../state/uiState";
import { applyStep } from "../state/applyStep";
import {StepPlayer} from "../../../shared/StepPlayer"
import { graphStateToGraph } from "../algorithms/graphConverter";
import { reconstructPath } from "../../../shared/ReconstructPath";
import { Play, Pause, SkipBack, SkipForward, Plus, Trash2, Target, Sun, Moon, Zap, RotateCcw } from "lucide-react";
import { runDijkstraAPI } from "../apis/runDijkstra";
import { applyProtocolStep } from "../state/reducers/protocolReducer";
import {ProtocolStepPlayer} from "../../../shared/ProtocolStepPlayer"
const initialGraphState : GraphState = {
    nodes : new Set(),
    edges: new Map(),
}

const Playground: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [graphState, dispatch] = useReducer(GraphReducer, initialGraphState);
  const [selectedNode, setSelectedNode] = useState<NodeId | null>(null);
  const [nodeCounter, setNodeCounter] = useState(0);
  const [uiState, setUIState] = useState(createInitialUIState());
  const [stepPlayer, setStepPlayer] = useState<StepPlayer | null>(null);
  const [source, setSource] = useState<NodeId|null>(null);
  const [parents, setParents] = useState<ParentMap | null>(null);
  const [target, setTarget] = useState<NodeId | null>(null)
  const [shortestPath, setShortestPath] = useState<NodeId[] | null>(null);
  const [isDirected, setIsDirected] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playTick, setPlayTick] = useState(0);
  const [algoDone, setAlgoDone]= useState(false);
  const [protocolPlayer, setProtocolPlayer] = useState<ProtocolStepPlayer | null>(null);

  
  const layout = createPhyllotaxisLayout(graphState.nodes);//createCircularLayout(graphState.nodes);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

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

    if (!Number.isFinite(weight)) {
        alert("Please enter a valid positive number");
        return;
    }

    dispatch({
        type: "ADD_EDGE",
        from: selectedNode,
        to: nodeId,
        weight: weight,
        directed: isDirected,
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

  const handleAlgorithStart = async()=>{
    setAlgoDone(false);
    if(!source){
        alert("Please select a source node.");
        return;
    }
    const graph = graphStateToGraph(graphState);
    const input = {graph, source}
    // const result = new Dijkstra().run(input);
    console.log("input: ",input);
    try {
      const result = await runDijkstraAPI(input);
      const player = new StepPlayer(result.steps);
      const initStep = player.current();
      console.log("initStep: ", initStep);
      if (initStep?.type === "INIT") {
        setUIState(prev => applyStep(prev, initStep));
      }
      console.log(result);
      setParents(result.parents);
      setStepPlayer(player);
      // setUIState(createInitialUIState());
      setShortestPath(null);
      setIsPlaying(false);
    } catch (error) {
        console.error(error);
        alert("Failed to run Dijkstra (check backend logs)");
    }
    
  }

  const handlePlay = useCallback(()=>{
    if (!stepPlayer) return;
    console.log(stepPlayer.current());
    const step = stepPlayer.next();
    if (!step) {
      setIsPlaying(false);
      return;
    }

    setUIState(prev => {
      const next = applyStep(prev, step);
      if(step.type === "DONE")setAlgoDone(true);
      if (step.type === "DONE" && parents && source) {
        if(!target){
          alert("Please select a target node to comute the shortest path.");
          return next;
        }
        const path = reconstructPath(parents, source, target);
        setShortestPath(path);
      }
      return next;
    });

    setPlayTick(t => t + 1);

  }, [stepPlayer, parents, source]);

  const handlePrev = ()=>{
    if(!stepPlayer)return;
    const step = stepPlayer.prev();
    if(!step)return;
    let state = createInitialUIState();
    for (let i = 0; i <= stepPlayer["index"]; i++) {
      const step = stepPlayer["steps"][i];
      state = applyStep(state, step);
    }
    setUIState(state);
    setIsPlaying(false);
    if(step.type !== "DONE"){
      setAlgoDone(false);
      setShortestPath(null);
    }
  }
  
  const handleSelectSource = ()=>{
    if(selectedNode){
        setSource(selectedNode);
        setSelectedNode(null);
    }
    console.log("source Selected: ", source);
    return;
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      "This will clear the entire graph and reset the algorithm. Continue?"
    );

    if (!confirmed) return;

    // Reset graph
    dispatch({ type: "RESET_GRAPH" });

    // Reset algorithm/UI state
    setSelectedNode(null);
    setSource(null);
    setParents(null);
    setShortestPath(null);
    setStepPlayer(null);
    setUIState(createInitialUIState());
    setNodeCounter(0);
    setAlgoDone(false);
    setIsPlaying(false);
  };

  const handleSetTarget = ()=>{
    if(selectedNode){
      setTarget(selectedNode);
      setSelectedNode(null);
    }
  }

  const startProtocol = async () => {
    const graph = graphStateToGraph(graphState);

    const res = await fetch("/api/protocol/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ graph: Object.fromEntries(graph) })
    });

    const { sessionId } = await res.json();
    setProtocolPlayer(new ProtocolStepPlayer(sessionId));
  };

  const playProtocolStep = async () => {
    if (!protocolPlayer) return;

    const step = await protocolPlayer.next();
    if (!step) return;

    setUIState(prev => applyProtocolStep(prev, step));
  };







  useEffect(() => {
    if (!isPlaying) return;
    if (!stepPlayer || !stepPlayer.hasNext()) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      handlePlay();
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, playTick]);

  useEffect(() => {
    if (!algoDone) return;
    if (!parents || !source || !target) return;

    const path = reconstructPath(parents, source, target);
    setShortestPath(path);
  }, [algoDone, parents, source, target]);



  const renderCurrentStep = () => {
    if(!stepPlayer) return <p className="text-sm text-gray-500 dark:text-gray-400">Run algorithm to see steps</p>;

    const step = stepPlayer.current();
    if (!step) return <p className="text-sm text-gray-500 dark:text-gray-400">No step yet</p>;

    switch (step.type) {
      case "INIT":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-blue-600 dark:text-blue-400">Initialization</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Source: {step.source}</div>
          </div>
        );

      case "PICK_NODE":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-purple-600 dark:text-purple-400">Pick Node</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Node <strong>{step.node}</strong> (dist: <strong>{step.distance}</strong>)
            </div>
          </div>
        );

      case "RELAX_EDGE":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-orange-600 dark:text-orange-400">Relax Edge</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {step.from} → {step.to} (weight: {step.edgeWeight})
            </div>
          </div>
        );

      case "UPDATE_DISTANCE":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-green-600 dark:text-green-400">Update Distance</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {step.to}: {step.oldDistance} → <strong>{step.newDistance}</strong>
            </div>
          </div>
        );

      case "MARK_VISITED":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-teal-600 dark:text-teal-400">Mark Visited</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Node {step.node} visited</div>
          </div>
        );

      case "DONE":
        return (
          <div className="space-y-2">
            <div className="font-semibold text-emerald-600 dark:text-emerald-400">Complete</div>
            <div className="text-sm text-gray-700 dark:text-gray-300">Last node: {step.lastNode}</div>
          </div>
        );
    }
  };

  const renderDistances = () => {
    if(!uiState.distances)return;
    const entries = Array.from(uiState.distances.entries());

    if (entries.length === 0) return <p className="text-sm text-gray-500 dark:text-gray-400">No data yet</p>;

    return (
      <div className="space-y-1">
        {entries.map(([node, dist]) => (
          <div key={node} className="flex items-center justify-between text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{node}</span>
            <span className="font-mono text-gray-600 dark:text-gray-400">
              {dist === null ? "∞" : dist}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs ${
              uiState.visited.has(node)
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}>
              {uiState.visited.has(node) ? "✓" : "·"}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderParents = () => {
    if (!parents) return <p className="text-sm text-gray-500 dark:text-gray-400">No parent data</p>;

    return (
      <div className="space-y-1">
        {Array.from(parents).map(([node, parent]) => (
          <div key={node} className="flex items-center gap-2 text-sm py-1 px-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">{node}</span>
            <span className="text-gray-400 dark:text-gray-600">←</span>
            <span className="font-mono text-gray-600 dark:text-gray-400">{parent ?? "—"}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderShortestPath = () => {
    if (!shortestPath) return <p className="text-sm text-gray-500 dark:text-gray-400">Path not computed yet</p>;

    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
        <p className="font-mono text-sm text-green-800 dark:text-green-400">{shortestPath.join(" → ")}</p>
      </div>
    );
  };

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
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Top Bar */}
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 bg-white dark:bg-gray-900">
        <h1 className="text-lg font-semibold">Dijkstra's Algorithm Visualizer</h1>
        
        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAddNode}
            className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Node
          </button>
          <button
            onClick={handleNodeDelete}
            disabled={!selectedNode}
            className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
          <button
            onClick={handleSelectSource}
            disabled={!selectedNode}
            className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-4 h-4" />
            Set Source
          </button>
          <button
            onClick={handleSetTarget}
            disabled={!selectedNode}
            className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <Target className="w-4 h-4" />
            Set Target
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
          
          <button
            onClick={handleAlgorithStart}
            disabled={!source}
            className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-4 h-4" />
            Run
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={handlePrev}
            disabled={!stepPlayer?.hasPrev()}
            className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={togglePlayPause}
            disabled={!stepPlayer?.hasNext()}
            className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={handlePlay}
            disabled={!stepPlayer?.hasNext()}
            className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
          
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={isDirected}
              onChange={() => setIsDirected(v => !v)}
              className="w-4 h-4 rounded border-gray-300 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">Directed</span>
          </label>
          
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2"></div>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-1.5 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas */}
        <div className="flex-1 p-4">
          <GraphCanvas 
            graphState={graphState} 
            layout={layout} 
            uiState={uiState} 
            selectedNode={selectedNode} 
            shortestPath={shortestPath} 
            onNodeClick={handleNodeClick}
          />
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
          {/* Info Panel */}
          {source && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
              <div className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 font-semibold mb-1">Source Node</div>
              <div className="font-mono text-lg font-bold text-purple-900 dark:text-purple-300">{source}</div>
            </div>
          )}
          
          {selectedNode && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
              <div className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-400 font-semibold mb-1">Selected Node</div>
              <div className="font-mono text-lg font-bold text-blue-900 dark:text-blue-300">{selectedNode}</div>
            </div>
          )}

          {/* Current Step */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">Current Step</div>
            {renderCurrentStep()}
          </div>

          {/* Distances */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">Distances</div>
            {renderDistances()}
          </div>

          {/* Parents */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">Parent Tree</div>
            {renderParents()}
          </div>

          {/* Shortest Path */}
          <div className="p-4">
            <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-3">Shortest Path</div>
            {renderShortestPath()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playground;