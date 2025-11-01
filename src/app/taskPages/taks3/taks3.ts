import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Edge, NgxGraphModule, Node } from '@swimlane/ngx-graph';

interface GraphNode {
  id: string;
  label: string;
  color: string;
  x?: number;
  y?: number;
}

interface GraphEdge {
  source: string;
  target: string;
  color: string;
}

@Component({
  selector: 'app-taks3',
  imports: [CommonModule, FormsModule, NgxGraphModule],
  templateUrl: './taks3.html',
  styleUrl: './taks3.css',
  standalone: true
})
export class Taks3 {
    graph: { [key: string]: string[] } = {};
    nodes: GraphNode[] = [];
    links: GraphEdge[] = [];
    startNode: string = '';
    inputNode: string = '';
    inputEdges: string = '';
    output: string[] = [];
    isRunning: boolean = false;

    private log(message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') {
      const timestamp = new Date().toLocaleTimeString();
      const styles = {
        info: 'color: white;',
        warning: 'color: orange; font-weight: bold;',
        error: 'color: red; font-weight: bold;',
        success: 'color: green; font-weight: bold;'
      };
      console.log(`%c[${timestamp}] ${message}`, styles[type]);
    }

    addNode() {
      if (!this.inputNode) {
        this.log('Node ID cannot be empty!', 'error');
        return;
      }

      const existingNode = this.nodes.find(n => n.id === this.inputNode);
      
      if (existingNode) {
        this.log(`Node "${this.inputNode}" already exists! Adding connections...`, 'warning');

        const edges = this.inputEdges.split(',').map(e => e.trim()).filter(Boolean);
        this.log(`Adding connections to "${this.inputNode}": [${edges.join(', ')}]`, 'info');

        this.graph[this.inputNode] = [...(this.graph[this.inputNode] || []), ...edges];
        
        for (const target of edges) {
          if (!this.nodes.find(n => n.id === target)) {
            this.log(`Target node "${target}" doesn't exist, creating it...`, 'warning');

            const targetCount = this.nodes.length;
            const targetX = 100 + (targetCount % 4) * 150;
            const targetY = 100 + Math.floor(targetCount / 4) * 100;
            
            this.nodes.push({
              id: target,
              label: target,
              color: '#007bff',
              x: targetX,
              y: targetY
            });
            this.graph[target] = this.graph[target] || [];
          }
          
          const existingLink = this.links.find(l => l.source === this.inputNode && l.target === target);
          if (!existingLink) {
            this.links.push({
              source: this.inputNode,
              target: target,
              color: '#888'
            });
            this.log(`Created edge: ${this.inputNode} → ${target}`, 'success');
          } else {
            this.log(`Edge ${this.inputNode} → ${target} already exists`, 'warning');
          }
        }

        this.inputNode = '';
        this.inputEdges = '';
        this.log(`Connections added to "${existingNode.id}". Total nodes: ${this.nodes.length}, edges: ${this.links.length}`, 'success');
        return;
      }

      this.log(`Adding new node: "${this.inputNode}"`, 'info');

      const nodeCount = this.nodes.length;
      const x = 100 + (nodeCount % 4) * 150;
      const y = 100 + Math.floor(nodeCount / 4) * 100;

      const newNode: GraphNode = {
        id: this.inputNode,
        label: this.inputNode,
        color: '#007bff',
        x: x,
        y: y
      };
      this.nodes.push(newNode);

      const edges = this.inputEdges.split(',').map(e => e.trim()).filter(Boolean);
      this.log(`Connections for "${this.inputNode}": [${edges.join(', ')}]`, 'info');
      
      this.graph[this.inputNode] = edges;
      
      for (const target of edges) {
        if (!this.nodes.find(n => n.id === target)) {
          this.log(`Target node "${target}" doesn't exist, creating it...`, 'warning');
          const targetCount = this.nodes.length;
          const targetX = 100 + (targetCount % 4) * 150;
          const targetY = 100 + Math.floor(targetCount / 4) * 100;
          
          this.nodes.push({
            id: target,
            label: target,
            color: '#007bff',
            x: targetX,
            y: targetY
          });
          this.graph[target] = this.graph[target] || [];
        }
        
        this.links.push({
          source: this.inputNode,
          target: target,
          color: '#888'
        });
        this.log(`Created edge: ${this.inputNode} → ${target}`, 'success');
      }

      this.inputNode = '';
      this.inputEdges = '';
      
      if (!this.startNode) {
        this.startNode = this.nodes[0].id;
        this.log(`Auto-selected start node: "${this.startNode}"`, 'info');
      }

      this.log(`Graph updated. Total nodes: ${this.nodes.length}, edges: ${this.links.length}`, 'success');
    }

    async runDFSVisual(start: string) {
      if (!start) {
        this.log('No start node selected for DFS visualization!', 'error');
        return;
      }

      if (this.isRunning) {
        this.log('Another algorithm is already running!', 'warning');
        return;
      }

      this.isRunning = true;
      this.log('=== STARTING DFS VISUALIZATION ===', 'info');
      this.resetColors();
      this.output = [];
      const visited = new Set<string>();

      const dfs = async (nodeId: string, depth: number = 0) => {
        if (visited.has(nodeId)) return;
        
        const indent = '  '.repeat(depth);
        this.log(`${indent}DFS VISITING: "${nodeId}"`, 'info');
        
        visited.add(nodeId);
        this.highlightNode(nodeId, '#dc3545');
        this.output.push(nodeId);

        await this.sleep(1000);

        const neighbors = this.links
          .filter(link => link.source === nodeId)
          .map(link => link.target);

        this.log(`${indent}Exploring neighbors: [${neighbors.join(', ')}]`, 'info');

        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            const link = this.links.find(l => l.source === nodeId && l.target === neighbor);
            if (link) {
              this.log(`${indent}→ Following edge to: "${neighbor}"`, 'info');
              this.highlightLink(link, '#ffc107');
              await this.sleep(800);
            }
            
            await dfs(neighbor, depth + 1);
          }
        }
        
        this.log(`${indent}Completed node: "${nodeId}"`, 'success');
        this.highlightNode(nodeId, '#28a745');
      };

      await dfs(start);
      this.log('=== DFS VISUALIZATION COMPLETED ===', 'success');
      this.isRunning = false;
    }

    async runBFSVisual(start: string) {
      if (!start) {
        this.log('No start node selected for BFS visualization!', 'error');
        return;
      }

      if (this.isRunning) {
        this.log('Another algorithm is already running!', 'warning');
        return;
      }

      this.isRunning = true;
      this.log('=== STARTING BFS VISUALIZATION ===', 'info');
      this.resetColors();
      this.output = [];
      const visited = new Set<string>();
      const queue: string[] = [start];
      
      this.log(`Initial queue: [${queue.join(', ')}]`, 'info');

      let level = 0;
      while (queue.length > 0) {
        this.log(`--- Processing level ${level} ---`, 'info');
        this.log(`Current queue: [${queue.join(', ')}]`, 'info');
        
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
          const nodeId = queue.shift()!;
          
          if (!visited.has(nodeId)) {
            this.log(`BFS VISITING: "${nodeId}" at level ${level}`, 'info');
            visited.add(nodeId);
            this.highlightNode(nodeId, '#dc3545');
            this.output.push(nodeId);

            await this.sleep(1200);

            const neighbors = this.links
              .filter(link => link.source === nodeId)
              .map(link => link.target);

            this.log(`Neighbors of "${nodeId}": [${neighbors.join(', ')}]`, 'info');

            for (const neighbor of neighbors) {
              if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                this.log(`Adding to queue: "${neighbor}"`, 'success');
                queue.push(neighbor);
                
                const link = this.links.find(l => l.source === nodeId && l.target === neighbor);
                if (link) {
                  this.highlightLink(link, '#ffc107');
                  await this.sleep(400);
                }
              }
            }
            
            this.highlightNode(nodeId, '#28a745');
          }
        }
        level++;
        await this.sleep(500);
      }
      
      this.log('=== BFS VISUALIZATION COMPLETED ===', 'success');
      this.isRunning = false;
    }

    sleep(ms: number): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    highlightNode(nodeId: string, color: string) {
      const node = this.nodes.find(n => n.id === nodeId);
      if (node) {
        node.color = color;
      }
    }

    highlightLink(link: GraphEdge, color: string) {
      link.color = color;
    }

    resetColors() {
      this.log('Resetting graph colors...', 'info');
      this.nodes.forEach(node => {
        node.color = '#007bff';
      });
      
      this.links.forEach(link => {
        link.color = '#888';
      });
    }

    clearGraph() {
      this.log('Clearing entire graph...', 'warning');
      this.graph = {};
      this.nodes = [];
      this.links = [];
      this.startNode = '';
      this.output = [];
      this.log('Graph cleared successfully', 'success');
    }

    loadExample1() {
      this.log('Loading example 1: Simple linear graph', 'info');
      this.clearGraph();

      const exampleData = [
        { id: 'A', x: 100, y: 200, edges: 'B' },
        { id: 'B', x: 250, y: 200, edges: 'C' },
        { id: 'C', x: 400, y: 200, edges: 'D' },
        { id: 'D', x: 550, y: 200, edges: '' }
      ];
      
      exampleData.forEach(data => {
        this.nodes.push({
          id: data.id,
          label: data.id,
          color: '#007bff',
          x: data.x,
          y: data.y
        });
        
        if (data.edges) {
          const edges = data.edges.split(',').map(e => e.trim()).filter(Boolean);
          this.graph[data.id] = edges;
          
          edges.forEach(target => {
            this.links.push({
              source: data.id,
              target: target,
              color: '#888'
            });
          });
        }
      });
      
      this.startNode = 'A';
      this.log('Example 1 loaded: A → B → C → D', 'success');
    }

    loadExample2() {
      this.log('Loading example 2: Binary tree-like structure', 'info');
      this.clearGraph();
      
      const exampleData = [
        { id: '1', x: 300, y: 100, edges: '2,3' },
        { id: '2', x: 200, y: 200, edges: '4,5' },
        { id: '3', x: 400, y: 200, edges: '6,7' },
        { id: '4', x: 150, y: 300, edges: '' },
        { id: '5', x: 250, y: 300, edges: '' },
        { id: '6', x: 350, y: 300, edges: '' },
        { id: '7', x: 450, y: 300, edges: '' }
      ];
      
      exampleData.forEach(data => {
        this.nodes.push({
          id: data.id,
          label: data.id,
          color: '#007bff',
          x: data.x,
          y: data.y
        });
        
        if (data.edges) {
          const edges = data.edges.split(',').map(e => e.trim()).filter(Boolean);
          this.graph[data.id] = edges;
          
          edges.forEach(target => {
            this.links.push({
              source: data.id,
              target: target,
              color: '#888'
            });
          });
        }
      });
      
      this.startNode = '1';
      this.log('Example 2 loaded: Binary tree structure', 'success');
    }

    onNodeDrag(event: MouseEvent, node: GraphNode) {
      const startX = event.clientX;
      const startY = event.clientY;
      const startNodeX = node.x || 0;
      const startNodeY = node.y || 0;

      const mouseMove = (moveEvent: MouseEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        node.x = startNodeX + dx;
        node.y = startNodeY + dy;
      };

      const mouseUp = () => {
        document.removeEventListener('mousemove', mouseMove);
        document.removeEventListener('mouseup', mouseUp);
      };

      document.addEventListener('mousemove', mouseMove);
      document.addEventListener('mouseup', mouseUp);
    }

    getNodeX(nodeId: string): number {
      const node = this.nodes.find(n => n.id === nodeId);
      return node?.x || 0;
    }

    getNodeY(nodeId: string): number {
      const node = this.nodes.find(n => n.id === nodeId);
      return node?.y || 0;
    }

    getNodeBadgeClass(index: number): string {
      if (index === 0) return 'bg-success';
      if (index === this.output.length - 1) return 'bg-info';
      return 'bg-secondary';
    }
}
