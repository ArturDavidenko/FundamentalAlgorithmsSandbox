import { Item, Recipe } from "../models/item.models";


export const ITEMS: Item[] = [
  // Basic Resources
  { id: 'wood', name: 'Wood', image: '🌲', quantity: 10 },
  { id: 'stone', name: 'Stone', image: '🗿', quantity: 8 },
  { id: 'iron_ore', name: 'Iron Ore', image: '⛏️', quantity: 6 },
  { id: 'coal', name: 'Coal', image: '⚫', quantity: 5 },
  
  // Crafted Basic Items
  { id: 'stick', name: 'Stick', image: '📏', quantity: 0 },
  { id: 'plank', name: 'Plank', image: '🧱', quantity: 0 },
  { id: 'iron_ingot', name: 'Iron Ingot', image: '🔩', quantity: 0 },
  
  // Advanced Materials
  { id: 'diamond', name: 'Diamond', image: '💎', quantity: 3 },
  { id: 'gold_ore', name: 'Gold Ore', image: '⭐', quantity: 4 },
  { id: 'gold_ingot', name: 'Gold Ingot', image: '🧈', quantity: 0 },
  
  // Tools & Weapons
  { id: 'pickaxe', name: 'Pickaxe', image: '⛏️', quantity: 0 },
  { id: 'sword', name: 'Sword', image: '⚔️', quantity: 0 },
  { id: 'torch', name: 'Torch', image: '🔦', quantity: 0 },
  { id: 'handle', name: 'Handle', image: '🔧', quantity: 0 },
  
  // Advanced Items
  { id: 'diamond_sword', name: 'Diamond Sword', image: '🗡️💎', quantity: 0 },
  { id: 'golden_sword', name: 'Golden Sword', image: '🗡️🌟', quantity: 0 },
  { id: 'diamond_pickaxe', name: 'Diamond Pickaxe', image: '💎⛏️', quantity: 0 },
  
  // 🚀 ULTIMATE ITEMS FOR ALGORITHM DEMONSTRATION
  { id: 'ultimate_tool', name: 'Ultimate Tool', image: '⚡🛠️', quantity: 0 },
  { id: 'master_sword', name: 'Master Sword', image: '🔥⚔️', quantity: 0 }
];

export const RECIPES: Recipe[] = [
  // Basic Recipes
  {
    id: 'plank_recipe',
    name: 'Planks from Wood',
    resultItemId: 'plank',
    components: [{ itemId: 'wood', quantity: 1 }]
  },
  {
    id: 'stick_recipe',
    name: 'Sticks from Planks',
    resultItemId: 'stick',
    components: [{ itemId: 'plank', quantity: 2 }]
  },
  {
    id: 'handle_recipe',
    name: 'Handle from Planks',
    resultItemId: 'handle',
    components: [{ itemId: 'plank', quantity: 2 }]
  },
  {
    id: 'iron_ingot_recipe',
    name: 'Iron Ingot',
    resultItemId: 'iron_ingot',
    components: [
      { itemId: 'iron_ore', quantity: 1 },
      { itemId: 'coal', quantity: 1 }
    ]
  },
  
  // Gold Processing
  {
    id: 'gold_ingot_recipe',
    name: 'Gold Ingot',
    resultItemId: 'gold_ingot',
    components: [
      { itemId: 'gold_ore', quantity: 2 },
      { itemId: 'coal', quantity: 1 }
    ]
  },
  
  // Basic Tools
  {
    id: 'pickaxe_recipe',
    name: 'Iron Pickaxe',
    resultItemId: 'pickaxe',
    components: [
      { itemId: 'stick', quantity: 2 },
      { itemId: 'iron_ingot', quantity: 3 }
    ]
  },
  {
    id: 'sword_recipe',
    name: 'Iron Sword',
    resultItemId: 'sword',
    components: [
      { itemId: 'handle', quantity: 1 },
      { itemId: 'iron_ingot', quantity: 2 }
    ]
  },
  {
    id: 'torch_recipe',
    name: 'Torch',
    resultItemId: 'torch',
    components: [
      { itemId: 'stick', quantity: 1 },
      { itemId: 'coal', quantity: 1 }
    ]
  },
  
  // Advanced Recipes
  {
    id: 'diamond_sword_recipe',
    name: 'Diamond Sword',
    resultItemId: 'diamond_sword',
    components: [
      { itemId: 'sword', quantity: 1 },       
      { itemId: 'diamond', quantity: 3 } 
    ]
  },
  
  {
    id: 'golden_sword_recipe',
    name: 'Golden Sword',
    resultItemId: 'golden_sword',
    components: [
      { itemId: 'handle', quantity: 1 },
      { itemId: 'gold_ingot', quantity: 3 }
    ]
  },
  
  {
    id: 'diamond_pickaxe_recipe',
    name: 'Diamond Pickaxe',
    resultItemId: 'diamond_pickaxe',
    components: [
      { itemId: 'pickaxe', quantity: 1 },      
      { itemId: 'diamond', quantity: 2 },      
      { itemId: 'gold_ingot', quantity: 1 }
    ]
  },
  
  // 🔥 ULTIMATE RECIPES FOR ALGORITHM DEMONSTRATION
  
  // Ultimate Tool - СЛОЖНЫЙ DFS ТЕСТ
  {
    id: 'ultimate_tool_recipe',
    name: 'Ultimate Tool',
    resultItemId: 'ultimate_tool',
    components: [
      { itemId: 'diamond_sword', quantity: 1 },  // ← Сложная цепочка
      { itemId: 'diamond_pickaxe', quantity: 1 }, // ← Еще сложная цепочка
      { itemId: 'golden_sword', quantity: 1 },    // ← Третья сложная цепочка
      { itemId: 'diamond', quantity: 5 }          // ← Дополнительные ресурсы
    ]
  },
  
  // Master Sword - АЛЬТЕРНАТИВНЫЙ СЛОЖНЫЙ РЕЦЕПТ
  {
    id: 'master_sword_recipe', 
    name: 'Master Sword',
    resultItemId: 'master_sword',
    components: [
      { itemId: 'diamond_sword', quantity: 1 },
      { itemId: 'golden_sword', quantity: 1 },
      { itemId: 'diamond', quantity: 3 },
      { itemId: 'gold_ingot', quantity: 2 }
    ]
  }
];