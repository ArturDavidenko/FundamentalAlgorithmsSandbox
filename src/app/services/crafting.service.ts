import { Component, computed, effect, Injectable, signal } from "@angular/core";
import { CraftingCheck, CraftingGraph, GraphEdge, GraphNode, Item, Recipe, RecipeComponent } from "../models/item.models";
import { ITEMS, RECIPES } from "../data/game-data";

@Injectable({
  providedIn: 'root'
})
export class CraftingService {
  // State signals
  private inventory = signal<Item[]>(this.initializeInventory());
  private selectedRecipe = signal<Recipe | null>(null);

  // Computed signals
  public inventoryItems = computed(() => this.inventory());
  public activeItems = computed(() => this.inventory().filter(item => item.isActive));
  public availableRecipes = computed(() => RECIPES);
  public currentRecipe = computed(() => this.selectedRecipe());

  // BFS for shortest path finding
  findShortestPath(startItemId: string, targetItemId: string): string[] {
    const visited = new Set<string>();
    const queue: { path: string[]; current: string }[] = [{ path: [startItemId], current: startItemId }];
    
    visited.add(startItemId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.current === targetItemId) {
        return current.path;
      }

      const recipes = RECIPES.filter(recipe => 
        recipe.components.some(comp => comp.itemId === current.current)
      );

      for (const recipe of recipes) {
        if (!visited.has(recipe.resultItemId)) {
          visited.add(recipe.resultItemId);
          queue.push({
            path: [...current.path, recipe.resultItemId],
            current: recipe.resultItemId
          });
        }
      }
    }

    return [];
  }

  // DFS for finding all base components (for visualization)
  findAllBaseComponents(itemId: string, visited = new Set<string>()): RecipeComponent[] {
    if (visited.has(itemId)) return [];
    visited.add(itemId);

    const recipe = RECIPES.find(r => r.resultItemId === itemId);
    if (!recipe) {
      const item = ITEMS.find(i => i.id === itemId);
      return item ? [{ itemId, quantity: 1 }] : [];
    }

    let components: RecipeComponent[] = [];
    for (const component of recipe.components) {
      const childComponents = this.findAllBaseComponents(component.itemId, new Set(visited));
      components = this.mergeComponents(components, childComponents, component.quantity);
    }

    return components;
  }

  private mergeComponents(existing: RecipeComponent[], newComponents: RecipeComponent[], multiplier: number): RecipeComponent[] {
    const result = [...existing];
    
    for (const comp of newComponents) {
      const existingComp = result.find(c => c.itemId === comp.itemId);
      if (existingComp) {
        existingComp.quantity += comp.quantity * multiplier;
      } else {
        result.push({ itemId: comp.itemId, quantity: comp.quantity * multiplier });
      }
    }
    
    return result;
  }

  // Create recipe graph
  createRecipeGraph(recipe: Recipe): CraftingGraph {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];
    const visited = new Set<string>();

    const addNode = (itemId: string, level: number) => {
      if (visited.has(itemId)) return;
      visited.add(itemId);

      const item = ITEMS.find(i => i.id === itemId);
      if (item) {
        nodes.push({ id: itemId, label: item.name, item: item, level: level });
      }

      const itemRecipe = RECIPES.find(r => r.resultItemId === itemId);
      if (itemRecipe) {
        itemRecipe.components.forEach((component) => {
          edges.push({
            id: `edge-${itemId}-${component.itemId}`,
            from: component.itemId,
            to: itemId,
            label: `${component.quantity}x`
          });
          addNode(component.itemId, level + 1);
        });
      }
    };

    addNode(recipe.resultItemId, 0);
    return { nodes, edges };
  }

  // Check if crafting is possible - OLD LOGIC
  canCraft(recipe: Recipe): CraftingCheck {
    const requiredComponents = this.findAllBaseComponents(recipe.resultItemId);
    const missing: RecipeComponent[] = [];
    
    for (const comp of requiredComponents) {
      const inventoryItem = this.inventory().find(item => item.id === comp.itemId);
      const availableQuantity = inventoryItem?.quantity || 0;
      
      if (availableQuantity < comp.quantity) {
        missing.push({ itemId: comp.itemId, quantity: comp.quantity - availableQuantity });
      }
    }

    return { canCraft: missing.length === 0, missing };
  }

  // Get required components for display (OLD LOGIC)
  getRequiredComponents(recipe: Recipe): RecipeComponent[] {
    return this.findAllBaseComponents(recipe.resultItemId);
  }

  // Check if item is available in inventory
  isItemAvailable(itemId: string): boolean {
    const inventoryItem = this.inventory().find(item => item.id === itemId);
    return (inventoryItem?.quantity || 0) > 0;
  }

  // Get item quantity from inventory
  getItemQuantity(itemId: string): number {
    const inventoryItem = this.inventory().find(item => item.id === itemId);
    return inventoryItem?.quantity || 0;
  }

  // Get item availability status for graph - FIXED VERSION
  getItemStatus(itemId: string): 'available' | 'missing' | 'intermediate' {
    const inventoryItem = this.inventory().find(item => item.id === itemId);
    const hasRecipe = RECIPES.some(recipe => recipe.resultItemId === itemId);
    
    // FIX: Check if quantity exists and is greater than 0
    if (inventoryItem && (inventoryItem.quantity ?? 0) > 0) {
      return hasRecipe ? 'intermediate' : 'available';
    }
    
    return 'missing';
  }

  // Execute crafting with proper validation
  craftItem(recipe: Recipe): boolean {
    const craftCheck = this.canCraft(recipe);
    
    if (!craftCheck.canCraft) {
      console.warn('Cannot craft: missing components', craftCheck.missing);
      return false;
    }

    // Calculate exactly what components we need to use
    const requiredComponents = this.findAllBaseComponents(recipe.resultItemId);
    
    let updatedInventory = [...this.inventory()];
    
    // Remove used components
    for (const comp of requiredComponents) {
      const itemIndex = updatedInventory.findIndex(item => item.id === comp.itemId);
      if (itemIndex !== -1) {
        const item = updatedInventory[itemIndex];
        if (item.quantity !== undefined) {
          const newQuantity = item.quantity - comp.quantity;
          if (newQuantity > 0) {
            updatedInventory[itemIndex] = { ...item, quantity: newQuantity };
          } else {
            updatedInventory.splice(itemIndex, 1);
          }
        }
      }
    }

    // Add crafted item
    const resultItem = ITEMS.find(item => item.id === recipe.resultItemId);
    if (resultItem) {
      const existingItemIndex = updatedInventory.findIndex(item => item.id === resultItem.id);
      if (existingItemIndex !== -1) {
        const existingItem = updatedInventory[existingItemIndex];
        updatedInventory[existingItemIndex] = {
          ...existingItem,
          quantity: (existingItem.quantity || 0) + 1
        };
      } else {
        updatedInventory.push({ 
          ...resultItem, 
          quantity: 1, 
          isActive: false 
        });
      }
    }

    this.inventory.set(updatedInventory);
    return true;
  }

  toggleItemActive(itemId: string): void {
    this.inventory.update(items => 
      items.map(item => 
        item.id === itemId ? { ...item, isActive: !item.isActive } : item
      )
    );
  }

  selectRecipe(recipe: Recipe): void {
    this.selectedRecipe.set(recipe);
  }

  clearSelectedRecipe(): void {
    this.selectedRecipe.set(null);
  }

  // Utility method to get item by ID
  getItemById(itemId: string): Item | undefined {
    return ITEMS.find(item => item.id === itemId);
  }

  // Utility method to get recipe by result item ID
  getRecipeByResultItemId(itemId: string): Recipe | undefined {
    return RECIPES.find(recipe => recipe.resultItemId === itemId);
  }

  // Reset inventory to initial state
  resetInventory(): void {
    this.inventory.set(this.initializeInventory());
  }

  // Add items to inventory (for testing)
  addItemsToInventory(items: { itemId: string, quantity: number }[]): void {
    this.inventory.update(currentInventory => {
      const newInventory = [...currentInventory];
      
      items.forEach(({ itemId, quantity }) => {
        const existingItemIndex = newInventory.findIndex(item => item.id === itemId);
        const itemData = ITEMS.find(item => item.id === itemId);
        
        if (existingItemIndex !== -1 && itemData) {
          const existingItem = newInventory[existingItemIndex];
          newInventory[existingItemIndex] = {
            ...existingItem,
            quantity: (existingItem.quantity || 0) + quantity
          };
        } else if (itemData) {
          newInventory.push({
            ...itemData,
            quantity: quantity,
            isActive: false
          });
        }
      });
      
      return newInventory;
    });
  }

  // Remove items from inventory (for testing)
  removeItemsFromInventory(items: { itemId: string, quantity: number }[]): void {
    this.inventory.update(currentInventory => {
      let newInventory = [...currentInventory];
      
      items.forEach(({ itemId, quantity }) => {
        const existingItemIndex = newInventory.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
          const existingItem = newInventory[existingItemIndex];
          const newQuantity = (existingItem.quantity || 0) - quantity;
          
          if (newQuantity > 0) {
            newInventory[existingItemIndex] = {
              ...existingItem,
              quantity: newQuantity
            };
          } else {
            newInventory.splice(existingItemIndex, 1);
          }
        }
      });
      
      return newInventory;
    });
  }

  // Get all recipes that can be crafted with current inventory
  getCraftableRecipes(): Recipe[] {
    return RECIPES.filter(recipe => this.canCraft(recipe).canCraft);
  }

  // Get recipes that require specific item
  getRecipesRequiringItem(itemId: string): Recipe[] {
    return RECIPES.filter(recipe => 
      this.findAllBaseComponents(recipe.resultItemId)
        .some(comp => comp.itemId === itemId)
    );
  }

  // Check if item is a base component (has no recipe)
  isBaseComponent(itemId: string): boolean {
    return !RECIPES.some(recipe => recipe.resultItemId === itemId);
  }

  // Get all base components needed for an item
  getBaseComponents(itemId: string): RecipeComponent[] {
    return this.findAllBaseComponents(itemId);
  }

  // Calculate total resources needed for multiple items
  calculateTotalResources(items: { itemId: string, quantity: number }[]): RecipeComponent[] {
    let totalComponents: RecipeComponent[] = [];
    
    items.forEach(({ itemId, quantity }) => {
      const components = this.findAllBaseComponents(itemId);
      components.forEach(comp => {
        comp.quantity *= quantity;
      });
      totalComponents = this.mergeComponents(totalComponents, components, 1);
    });
    
    return totalComponents;
  }

  private initializeInventory(): Item[] {
    return ITEMS.filter(item => item.quantity && item.quantity > 0)
               .map(item => ({ ...item, isActive: false }));
  }
}

