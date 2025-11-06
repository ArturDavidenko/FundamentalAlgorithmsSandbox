import { Component, inject } from '@angular/core';
import { Inventory } from '../../components/inventory/inventory';
import { CraftingPanel } from '../../components/craftingPanel/crafting-panel';
import { Recipes } from '../../components/recipes/recipes';
import { CraftingService } from '../../services/crafting.service';

@Component({
  selector: 'app-crafting-page',
  imports: [Inventory, CraftingPanel, Recipes],
  templateUrl: './crafting-page.html',
  styleUrl: './crafting-page.css'
})
export class CraftingPage {
  private craftingService = inject(CraftingService);
  
  ngOnInit(){
    console.log('Example of BFS from wood to diamond sword:', this.craftingService.findShortestPath('coal', 'ultimate_tool'))
    console.log(this.craftingService.findAllBaseComponents('ultimate_tool'))
  }
}
