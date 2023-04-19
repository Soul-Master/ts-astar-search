import { BinaryHeap } from './binaryHeap.js';
import type { GraphNode, GraphPosition } from './graph.js';

export class AStar {
    constructor(public grid: GraphNode[][], public start: GraphNode, public end: GraphNode) {}

    search() {
        let currentNode: GraphNode;
        let curr: GraphNode;
        let neighbor: GraphNode;
        let i: number;
        let gScore: number;
        let beenVisited: boolean;

        const openHeap = new BinaryHeap(getHeapWeight);

        openHeap.push(this.start);

        while(openHeap.size > 0) {

            // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
            currentNode = openHeap.pop();

            // End case -- result has been found, return the traced path.
            if(currentNode === this.end) {
                curr = currentNode;
                const ret = [];

                while(curr.parent) {
                    ret.push(curr);
                    curr = curr.parent;
                }
                return [this.start, ...ret.reverse()];
            }

            // Normal case -- move currentNode from open to closed, process each of its neighbors.
            currentNode.closed = true;

            // Find all neighbors for the current node
            const neighbors = this.neighbors(this.grid, currentNode);

            for(let i=0, il = neighbors.length; i < il; i++) {
                neighbor = neighbors[i];

                if(neighbor.closed) {
                    // Not a valid node to process, skip to next neighbor.
                    continue;
                }

                // The g score is the shortest distance from start to current node.
                // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                gScore = currentNode.g + neighbor.cost;
                beenVisited = neighbor.visited;

                if(!beenVisited || gScore < neighbor.g) {

                    // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                    neighbor.visited = true;
                    neighbor.parent = currentNode;
                    neighbor.h = neighbor.h || heuristic(neighbor.pos, this.end.pos);
                    neighbor.g = gScore;
                    neighbor.f = neighbor.g + neighbor.h;

                    if (!beenVisited) {
                        // Pushing to heap will put it in proper place based on the 'f' value.
                        openHeap.push(neighbor);
                    }
                    else {
                        // Already seen the node, but since it has been rescored we need to reorder it in the heap
                        openHeap.rescoreElement(neighbor);
                    }
                }
            }
        }

        // No result was found - empty array signifies failure to find path.
        return [];
    }

    neighbors(grid: GraphNode[][], node: GraphNode) {
        const result: GraphNode[] = [];
        const x = node.x;
        const y = node.y;

        // West
        if(grid[x-1] && grid[x-1][y]) {
            result.push(grid[x-1][y]);
        }

        // East
        if(grid[x+1] && grid[x+1][y]) {
            result.push(grid[x+1][y]);
        }

        // South
        if(grid[x] && grid[x][y-1]) {
            result.push(grid[x][y-1]);
        }

        // North
        if(grid[x] && grid[x][y+1]) {
            result.push(grid[x][y+1]);
        }

        return result;
    }
}

export function heuristic(pos0: GraphPosition, pos1: GraphPosition) {
    return Math.abs (pos1.x - pos0.x) + Math.abs (pos1.y - pos0.y);
}

function getHeapWeight(node: GraphNode) {
    return node.f;
}