import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { CraftingService } from '../../services/crafting.service';
import { Item } from '../../models/item.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css'
})
export class Inventory implements OnInit {
  private craftingService = inject(CraftingService);
  
  inventoryItems = this.craftingService.inventoryItems;
  filteredItems = signal<Item[]>([]);
  searchQuery = signal<string>('');

  constructor() {
    effect(() => {
      const items = this.inventoryItems();
      this.filterItems();
    });
  }

  ngOnInit() {
    this.filteredItems.set(this.inventoryItems());
  }

  toggleActive(itemId: string): void {
    this.craftingService.toggleItemActive(itemId);
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.filterItems();
  }

  filterItems(): void {
    const query = this.searchQuery().toLowerCase();
    const items = this.inventoryItems();
    this.filteredItems.set(
      query ? items.filter(item => item.name.toLowerCase().includes(query)) : items
    );
  }
}
