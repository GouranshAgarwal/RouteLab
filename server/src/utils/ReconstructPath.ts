import { NodeId, ParentMap } from "../algorithms/ts/types";

export function reconstructPath( // make the shortest path from source to target using parent map
    parents: ParentMap,
    source: NodeId,
    target: NodeId
): NodeId[]{
    const path: NodeId[] = [];
    let currentNode: NodeId | null = target;
    while(currentNode != null){
        path.push(currentNode);
        if(currentNode === source)break;
        const parent = parents.get(currentNode); // parent map is like [childNode -> parentNode] == [B -> A, C -> B]
        if(parent === undefined){
            break;
        }
        currentNode = parent; // we are going from target to source
    }
    const result = path.reverse(); // current path is from target to source so reverse it 
    return result[0] === source ? result : []; // avoids returning wrong paths i.e just the target node, where target can't be reached from source 
}