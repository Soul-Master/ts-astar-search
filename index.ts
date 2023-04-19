#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { AStar } from './astar.js';
import { Graph } from './graph.js';

const filePath = process.argv[2];
const fileContent = readFileSync(filePath, 'utf-8');
const input = parseInput(fileContent);

const startTime = performance.now();

const graph = new Graph(input);
const startNode = graph.nodes[0][0];
const endNode = graph.nodes[input.length - 1][input[0].length - 1];
const astar = new AStar(graph.nodes, startNode, endNode);
const result = astar.search();
const totalWeight = result.reduce((result, item) => {
    return result + item.cost;
}, 0);

const totalTime = performance.now() - startTime;

console.info('Total Weight: ', totalWeight);
console.info('Total Time: ', totalTime);

function parseInput(input: string) {
    const rows = input.trim().split('\n');

    return rows.map(row => row.split(' ').map(Number));
}