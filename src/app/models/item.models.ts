export interface Item {
  id: string;
  name: string;
  image: string;
  description?: string;
  isActive?: boolean;
  quantity?: number;
}

export interface Recipe {
  id: string;
  name: string;
  resultItemId: string;
  components: RecipeComponent[];
}

export interface RecipeComponent {
  itemId: string;
  quantity: number;
}

export interface GraphNode {
  id: string;
  label: string;
  item: Item;
  level?: number;
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
}

export interface CraftingGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface CraftingCheck {
  canCraft: boolean;
  missing: RecipeComponent[];
}