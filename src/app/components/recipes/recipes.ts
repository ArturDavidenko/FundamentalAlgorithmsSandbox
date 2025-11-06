import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CraftingService } from '../../services/crafting.service';
import { CraftingGraph, Recipe } from '../../models/item.models';
import { GraphVisualization } from '../graph-visualization/graph-visualization';

@Component({
  selector: 'app-recipes',
  imports: [CommonModule, FormsModule, GraphVisualization],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css'
})
export class Recipes implements OnInit {
  private craftingService = inject(CraftingService);
  
  recipes = this.craftingService.availableRecipes;
  currentRecipe = this.craftingService.currentRecipe;
  
  searchQuery = signal<string>('');
  sortBy = signal<string>('name');
  filteredRecipes = signal<Recipe[]>([]);
  currentRecipeGraph = signal<CraftingGraph | null>(null);

  ngOnInit() {
    this.filteredRecipes.set(this.recipes());
  }

  selectRecipe(recipe: Recipe): void {
    this.craftingService.selectRecipe(recipe);
    const graph = this.craftingService.createRecipeGraph(recipe);
    this.currentRecipeGraph.set(graph);
  }

  getItemName(itemId: string): string {
    const item = this.craftingService.inventoryItems().find(i => i.id === itemId);
    return item?.name || itemId;
  }

  getItemImage(itemId: string): string {
    const item = this.craftingService.inventoryItems().find(i => i.id === itemId);
    return item?.image || '❓';
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.filterRecipes();
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.sortBy.set(value);
    this.filterRecipes();
  }

  filterRecipes(): void {
    const query = this.searchQuery().toLowerCase();
    const sortBy = this.sortBy();
    
    let filtered = this.recipes().filter(recipe => 
      recipe.name.toLowerCase().includes(query) ||
      this.getItemName(recipe.resultItemId).toLowerCase().includes(query)
    );

    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return this.getItemName(a.resultItemId).localeCompare(this.getItemName(b.resultItemId));
      } else {
        const aComplexity = this.craftingService.findAllBaseComponents(a.resultItemId).length;
        const bComplexity = this.craftingService.findAllBaseComponents(b.resultItemId).length;
        return aComplexity - bComplexity;
      }
    });

    this.filteredRecipes.set(filtered);
  }
}
