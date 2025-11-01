import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';


interface Node {
  id: string;
  label: string;
}

interface Edge {
  source: string;
  target: string;
  weight: number;    
  time: number;  
}

interface GraphNode extends Node {
  x: number;
  y: number;
  color: string;
}

@Component({
  selector: 'app-taks4',
  imports: [CommonModule, FormsModule],
  templateUrl: './taks4.html',
  styleUrl: './taks4.css'
})

export class Taks4 {
  nodes: GraphNode[] = [];
  edges: Edge[] = [];
  
  startNode: string = 'A';
  endNode: string = 'B';
  resultPath: string = '';
  calculationSteps: string[] = [];

  newNodeId: string = '';
  newEdgeSource: string = '';
  newEdgeTarget: string = '';
  newEdgeWeight: number = 1;
  newEdgeTime: number = 1;

  constructor() {
    this.createSampleGraph();
  }

  createSampleGraph() {
    this.nodes = [
      { id: 'A', label: 'A', x: 100, y: 200, color: '#007bff' },
      { id: 'B', label: 'B', x: 300, y: 100, color: '#007bff' },
      { id: 'C', label: 'C', x: 300, y: 300, color: '#007bff' },
      { id: 'D', label: 'D', x: 500, y: 200, color: '#007bff' }
    ];

    this.edges = [
      { source: 'A', target: 'B', weight: 4, time: 10 },
      { source: 'A', target: 'C', weight: 2, time: 5 },
      { source: 'B', target: 'D', weight: 5, time: 15 },
      { source: 'C', target: 'D', weight: 8, time: 20 },
      { source: 'B', target: 'C', weight: 1, time: 3 }
    ];
  }

  addNode() {
    if (this.newNodeId && !this.nodes.find(n => n.id === this.newNodeId)) {
      const newNode: GraphNode = {
        id: this.newNodeId,
        label: this.newNodeId,
        x: 100 + (this.nodes.length * 80),
        y: 100 + (this.nodes.length % 3 * 100),
        color: '#007bff'
      };
      this.nodes.push(newNode);
      this.newNodeId = '';
    }
  }

  addEdge() {
    if (this.newEdgeSource && this.newEdgeTarget && this.newEdgeWeight > 0 && this.newEdgeTime > 0) {
      const newEdge: Edge = {
        source: this.newEdgeSource,
        target: this.newEdgeTarget,
        weight: this.newEdgeWeight,
        time: this.newEdgeTime
      };
      this.edges.push(newEdge);

      this.newEdgeSource = '';
      this.newEdgeTarget = '';
      this.newEdgeWeight = 1;
      this.newEdgeTime = 1;
    }
  }

  shortestDijkstra() {
    this.resetColors();
    this.calculationSteps = [];
    this.resultPath = '';
    
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();
    
    this.nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    distances[this.startNode] = 0;
    
    this.calculationSteps.push(`Starting from node ${this.startNode}, distance = 0`);
    
    while (unvisited.size > 0) {
      let current: string | null = null;
      for (const node of unvisited) {
        if (current === null || distances[node] < distances[current]) {
          current = node;
        }
      }
      
      if (current === null || distances[current] === Infinity) break;
      
      unvisited.delete(current);
      this.calculationSteps.push(`Processing node ${current}, distance = ${distances[current]}`);

      if (current === this.endNode) {
        this.resultPath = this.reconstructPath(previous, this.endNode);
        this.highlightPath(this.resultPath);
        this.calculationSteps.push(`Path found: ${this.resultPath}`);
        return;
      }

      const neighbors = this.edges.filter(edge => edge.source === current);
      for (const edge of neighbors) {
        if (unvisited.has(edge.target)) {
          const newDistance = distances[current] + edge.weight;
          if (newDistance < distances[edge.target]) {
            distances[edge.target] = newDistance;
            previous[edge.target] = current;
            this.calculationSteps.push(`Updating ${edge.target}: ${distances[edge.target]} via ${current}`);
          }
        }
      }
    }
    
    this.resultPath = 'Path not found';
  }

  fastestDijkstra() {
    this.resetColors();
    this.calculationSteps = [];
    this.resultPath = '';
    
    const times: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();
    
    this.nodes.forEach(node => {
      times[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });
    times[this.startNode] = 0;
    
    this.calculationSteps.push(`Starting from node ${this.startNode}, time = 0`);
    
    while (unvisited.size > 0) {
      let current: string | null = null;
      for (const node of unvisited) {
        if (current === null || times[node] < times[current]) {
          current = node;
        }
      }
      
      if (current === null || times[current] === Infinity) break;
      
      unvisited.delete(current);
      this.calculationSteps.push(`Processing node ${current}, time = ${times[current]}`);
      
      if (current === this.endNode) {
        this.resultPath = this.reconstructPath(previous, this.endNode);
        this.highlightPath(this.resultPath);
        this.calculationSteps.push(`Path found: ${this.resultPath}`);
        return;
      }
      
      const neighbors = this.edges.filter(edge => edge.source === current);
      for (const edge of neighbors) {
        if (unvisited.has(edge.target)) {
          const newTime = times[current] + edge.time;
          if (newTime < times[edge.target]) {
            times[edge.target] = newTime;
            previous[edge.target] = current;
            this.calculationSteps.push(`Updating ${edge.target}: ${times[edge.target]} via ${current}`);
          }
        }
      }
    }
    
    this.resultPath = 'Path not found';
  }

  private reconstructPath(previous: { [key: string]: string | null }, endNode: string): string {
    const path: string[] = [];
    let current: string | null = endNode;
    
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
    
    return path.join(' → ');
  }

  private highlightPath(path: string) {
    const nodes = path.split(' → ');
    
    nodes.forEach(node => {
      const graphNode = this.nodes.find(n => n.id === node);
      if (graphNode) {
        graphNode.color = '#28a745';
      }
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      const edge = this.edges.find(e => 
        e.source === nodes[i] && e.target === nodes[i + 1]
      );
      if (edge) {
      }
    }
  }

  reset() {
    this.resetColors();
    this.resultPath = '';
    this.calculationSteps = [];
  }

  private resetColors() {
    this.nodes.forEach(node => {
      node.color = '#007bff';
    });
  }

  getNodeX(nodeId: string): number {
    const node = this.nodes.find(n => n.id === nodeId);
    return node?.x || 0;
  }

  getNodeY(nodeId: string): number {
    const node = this.nodes.find(n => n.id === nodeId);
    return node?.y || 0;
  }
}
