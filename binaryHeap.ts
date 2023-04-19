import type { GraphNode } from './graph.js';

export type ScoreFn = (node: GraphNode) => number;

export class BinaryHeap {
    content: GraphNode[] = [];

    get size() {
        return this.content.length;
    }

    constructor(public scoreFunction: ScoreFn) {

    }

    push(element: GraphNode) {
        // Add the new element to the end of the array.
        this.content.push(element);

        // Allow it to sink down.
        this.sinkDown(this.content.length - 1);
    }

    pop() {
        // Store the first element so we can return it later.
        const result = this.content[0];
        // Get the element at the end of the array.
        const end = this.content.pop()!;
        // If there are any elements left, put the end element at the
        // start, and let it bubble up.

        if (this.content.length > 0) {
            this.content[0] = end;
            this.bubbleUp(0);
        }

        return result;
    }

    rescoreElement(node: GraphNode) {
        this.sinkDown(this.content.indexOf(node));
    }

    sinkDown(n: number) {
        let parentN: number;
        let parent: GraphNode;

        // Fetch the element that has to be sunk.
        const element = this.content[n];

        // When at 0, an element can not sink any further.
        while (n > 0) {
            // Compute the parent element's index, and fetch it.
            parentN = ((n + 1) >> 1) - 1;
            parent = this.content[parentN];

            // Swap the elements if the parent is greater.
            if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                this.content[parentN] = element;
                this.content[n] = parent;

                // Update 'n' to continue at the new position.
                n = parentN;
            }
            else {
                // Found a parent that is less, no need to sink any further.
                break;
            }
        }
    }

    bubbleUp(n: number) {
        let child1N: number;
        let child2N: number;
        let swap: number | null;
        let child1: GraphNode;
        let child2: GraphNode;

        // Look up the target element and its score.
        const length = this.content.length;
        const element = this.content[n];
        const elemScore = this.scoreFunction(element);

        while(true) {
            // Compute the indices of the child elements.
            child2N = (n + 1) << 1, child1N = child2N - 1;
            // This is used to store the new position of the element,
            // if any.
            swap = null;

            let child1Score = 0;
            let child2Score = 0;

            // If the first child exists (is inside the array)...
            if (child1N < length) {
                // Look it up and compute its score.
                child1 = this.content[child1N];
                child1Score = this.scoreFunction(child1);

                // If the score is less than our element's, we need to swap.
                if (child1Score < elemScore){
                    swap = child1N;
                }
            }

            // Do the same checks for the other child.
            if (child2N < length) {
                child2 = this.content[child2N];
                child2Score = this.scoreFunction(child2);

                if (child2Score < (swap === null ? elemScore : child1Score)) {
                    swap = child2N;
                }
            }

            // If the element needs to be moved, swap it, and continue.
            if (swap !== null) {
                this.content[n] = this.content[swap];
                this.content[swap] = element;
                n = swap;
            }

            // Otherwise, we are done.
            else {
                break;
            }
        }
    }
}