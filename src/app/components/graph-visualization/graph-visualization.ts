import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CraftingGraph, GraphNode } from '../../models/item.models';
import { CraftingService } from '../../services/crafting.service';

@Component({
  selector: 'app-graph-visualization',
  imports: [CommonModule],
  templateUrl: './graph-visualization.html',
  styleUrl: './graph-visualization.css'
})
export class GraphVisualization implements OnChanges {
  @Input() graph: CraftingGraph | null = null;
  private craftingService = inject(CraftingService);

  svgWidth = 1000;
  svgHeight = 600;
  positionedNodes: any[] = [];
  positionedEdges: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (this.graph) {
      this.calculateLayout();
    }
  }

  calculateLayout(): void {
    if (!this.graph) return;

    const levels = new Map<number, any[]>();
    
    this.graph.nodes.forEach(node => {
      const level = node.level || 0;
      if (!levels.has(level)) {
        levels.set(level, []);
      }
      levels.get(level)!.push(node);
    });

    const maxLevel = Math.max(...levels.keys());
    const maxNodesInLevel = Math.max(...Array.from(levels.values()).map(nodes => nodes.length));
    
    this.svgWidth = Math.max(1000, maxNodesInLevel * 150);
    this.svgHeight = Math.max(600, (maxLevel + 1) * 150);

    this.positionedNodes = [];
    levels.forEach((nodes, level) => {
      const y = 100 + (level / maxLevel) * (this.svgHeight - 200);
      const spacing = this.svgWidth / (nodes.length + 1);
      
      nodes.forEach((node, index) => {
        const x = spacing * (index + 1);
        this.positionedNodes.push({ ...node, x, y });
      });
    });

    this.positionedEdges = this.graph.edges.map(edge => {
      const source = this.positionedNodes.find(n => n.id === edge.from);
      const target = this.positionedNodes.find(n => n.id === edge.to);
      return source && target ? { ...edge, source, target } : null;
    }).filter(edge => edge !== null) as any[];
  }

  getNodeClass(node: any): string {
    const status = this.craftingService.getItemStatus(node.id);
    
    if (node.level === 0) return 'node-final';
    
    switch (status) {
      case 'available': return 'node-available';
      case 'intermediate': return 'node-intermediate';
      case 'missing': return 'node-missing';
      default: return 'node-missing';
    }
  }

  getItemQuantity(itemId: string): number {
    return this.craftingService.getItemQuantity(itemId);
  }

  onNodeClick(node: any): void {
    console.log('Node clicked:', node);
  }
}
