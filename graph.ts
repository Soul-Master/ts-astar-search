export interface GraphPosition {
    x: number;
    y: number;
}

export class Graph {
    nodes: GraphNode[][] = [];

    constructor(public input: number[][]) {
        let x: number, y : number;
        let row: number[];

        for (x = 0; x < input.length; x++) {
            this.nodes[x] = [];
            row = input[x]; 

            for (y = 0; y < row.length; y++) {
                this.nodes[x][y] = new GraphNode(x, y, row[y]);
            }
        }
    }
}

export class GraphNode {
    visited = false;
    closed = false;
    f = 0;
    g = 0;
    h = 0;
    data = {};
    pos: GraphPosition;
    parent: GraphNode | null = null;

    constructor(public x: number, public y: number, public cost: number) {
        this.pos = { x, y };
    }
}