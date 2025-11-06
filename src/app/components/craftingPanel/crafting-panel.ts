import { Component, computed, inject } from '@angular/core';
import { CraftingCheck } from '../../models/item.models';
import { CraftingService } from '../../services/crafting.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crafting-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './crafting-panel.html',
  styleUrl: './crafting-panel.css'
})
export class CraftingPanel {
  private craftingService = inject(CraftingService);
  
  activeItems = this.craftingService.activeItems;
  currentRecipe = this.craftingService.currentRecipe;
  
  craftCheck = computed(() => {
    const recipe = this.currentRecipe();
    return recipe ? this.craftingService.canCraft(recipe) : { canCraft: false, missing: [] };
  });

  getRecipeItem() {
    const recipe = this.currentRecipe();
    return recipe ? this.craftingService.inventoryItems().find(item => item.id === recipe.resultItemId) : null;
  }

  getItemName(itemId: string): string {
    const item = this.craftingService.inventoryItems().find(i => i.id === itemId);
    return item?.name || itemId;
  }

  getItemImage(itemId: string): string {
    const item = this.craftingService.inventoryItems().find(i => i.id === itemId);
    return item?.image || '❓';
  }

  getRequiredComponents() {
    const recipe = this.currentRecipe();
    return recipe ? this.craftingService.getRequiredComponents(recipe) : [];
  }

  isComponentAvailable(component: any): boolean {
    const inventoryItem = this.craftingService.inventoryItems().find(item => item.id === component.itemId);
    return (inventoryItem?.quantity || 0) >= component.quantity;
  }

  getItemQuantity(itemId: string): number {
    return this.craftingService.getItemQuantity(itemId);
  }

  craft(): void {
    const recipe = this.currentRecipe();
    if (recipe) {
      const success = this.craftingService.craftItem(recipe);
      if (success) {
        console.log('Item crafted successfully!');
      }
    }
  }

  clearRecipe(): void {
    this.craftingService.clearSelectedRecipe();
  }
}
