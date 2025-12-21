import { AlgorithmResult, RoutingAlgorithm } from "./interface";
import { AlgorithmInput, Graph, DistMap, ParentMap, NodeId, HeapNode, DijkstraStep } from "./types";

class MinHeap{
    private heap : HeapNode[] = [];

    private swap(i:number, j:number):void{
        const temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }

    private bubbleUp(index:number):void{
        
        while(index > 0){
            let smallest = index;
            const parentIndex = Math.floor((index-1)/2);
            if(this.heap[parentIndex].distance > this.heap[index].distance){
                smallest = parentIndex;
            }
            if(smallest != index){
                this.swap(smallest, index);
                index = smallest;   
            }else{
                break;
            }
        }
    }

    private bubbleDown(index:number):void{
        const length = this.heap.length;
        
        while(true){
            let smallest = index;
            const left = 2*index + 1;
            const right = 2*index + 2;
            if(left < length && this.heap[left].distance < this.heap[smallest].distance){
                smallest = left;
            }
            if(right < length && this.heap[right].distance < this.heap[smallest].distance){
                smallest = right;
            }
            if(smallest != index){
                this.swap(smallest, index);
                index = smallest;
            }else{
                break;
            }
        }
    }
    
    public insert({nodeId, distance} : HeapNode):void{
        const index = this.heap.push({nodeId, distance});
        this.bubbleUp(index - 1);
    } 

    public extractMin(): HeapNode | null{
        if(this.heap.length === 0)return null;
        if(this.heap.length === 1)return this.heap.pop() || null;

        const min = this.heap[0];
        this.heap[0] = this.heap.pop() as HeapNode;
        this.bubbleDown(0);
        return min;
    }

    public isEmpty():boolean{
        return this.heap.length === 0;
    }

    public peek():HeapNode | null{
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    public size(): number {
        return this.heap.length;
    }
}
class Dijkstra implements RoutingAlgorithm{
    // No constructor needed since we will be switching from TS to CPP, it is running statelessly now;
    run( input: AlgorithmInput) : AlgorithmResult{
        const {graph, source} = input;

        const distances : DistMap = new Map();
        const parents: ParentMap = new Map();
        const visited : Set<NodeId> = new Set();
        const steps : DijkstraStep[] = [];

        // Main Dijkstra loop will go here (each state will emit a visualization step)

        // Initialize distances and parents
        const nodes = new Set<NodeId>();
        graph.forEach((edges, nodeId)=>{
            nodes.add(nodeId); // each key in graph is a node
            edges.forEach(edge=>nodes.add(edge.to)); // all nodes connected to that key are also nodes in graph
        });

        nodes.forEach(nodeId=>{
            distances.set(nodeId, Infinity); // distance contains something like [A: Infinity, B: Infinity, C: Infinity ...]
            parents.set(nodeId, null); // parents contains something like [A: null, B: null, C: null ...]
        })
        distances.set(source, 0); // distance to source is 0

        steps.push({
            type:"INIT",
            source,
            distancesSnapshot: new Map(distances) // distances is DistMap -> Map for distancesSnapshot
        })

        // Dijkastra loop logic
        const minHeap = new MinHeap();
        minHeap.insert({nodeId: source, distance: 0});
        let lastNode : NodeId | null = null;

        while(!minHeap.isEmpty()){
            const minNode = minHeap.extractMin();
            if(!minNode) break; // since extractMin is returning a null value too in empty cases (Typescript)
            const {nodeId, distance} = minNode;

            const currDist = distances.get(nodeId);
            if(visited.has(nodeId)) continue;
            if(currDist === undefined) continue;
            if(distance !== currDist)continue;

            steps.push({
                type:"PICK_NODE",
                node:nodeId,
                distance:distance
            })

            visited.add(nodeId);
            lastNode = nodeId;
            steps.push({
                type:"MARK_VISITED",
                node:nodeId
            })

            const edges = graph.get(nodeId);
            if(!edges) continue;
            // edges.forEach(edge=>{
            for(const edge of edges){
                if(visited.has(edge.to))continue;
                
                const newDist = currDist + edge.weight;
                const nxtDist = distances.get(edge.to);
                if(nxtDist === undefined) continue;
                steps.push({
                    type:"RELAX_EDGE",
                    from:nodeId,
                    to:edge.to,
                    currentDistance:currDist,
                    edgeWeight:edge.weight
                })

                if( newDist < nxtDist){
                    distances.set(edge.to, newDist);
                    parents.set(edge.to, nodeId);
                    minHeap.insert({nodeId: edge.to, distance: newDist});

                    steps.push({
                        type:"UPDATE_DISTANCE",
                        from:nodeId,
                        to:edge.to,
                        oldDistance:nxtDist,
                        newDistance:newDist
                    })    
                }
            }
        }
        steps.push({
            type:"DONE" ,
            lastNode: lastNode!
        })
        return {
            distances,
            parents,
            steps,
        };
    }
}

export {Dijkstra};