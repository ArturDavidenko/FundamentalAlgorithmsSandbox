import { Component, signal } from '@angular/core';
import { CodeRunner } from '../../services/code-runner.service';
import { OnInit } from '../../../../node_modules/@angular/core/index';

class TreeNode {
  constructor(
    public value: number,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

@Component({
  selector: 'app-taks2',
  imports: [],
  templateUrl: './taks2.html',
  styleUrl: './taks2.css'
})
export class Taks2 implements OnInit{
  numbers: number[] = [];
  root: TreeNode | null = null;

  constructor(private codeRunner: CodeRunner) {}


  ngOnInit(): void {
    this.generateAndBuild();
  }

  generateUniqueNumbers(count: number): number[] {
    const set = new Set<number>();
    while (set.size < count) {
      set.add(Math.floor(Math.random() * 1000));
    }
    return Array.from(set);
  }

  buildBalancedBST(sortedNums: number[]): TreeNode | null {
    if (sortedNums.length === 0) return null;
    const mid = Math.floor(sortedNums.length / 2);
    const node = new TreeNode(sortedNums[mid]);
    node.left = this.buildBalancedBST(sortedNums.slice(0, mid));
    node.right = this.buildBalancedBST(sortedNums.slice(mid + 1));
    return node;
  }

  generateAndBuild() {
    this.numbers = this.generateUniqueNumbers(50);
    this.numbers.sort((a, b) => a - b);
    this.root = this.buildBalancedBST(this.numbers);
    console.log('BST built successfully');
  }

  /** 3️⃣ Поиск с выводом пути */
  search(value: number, node: TreeNode | null = this.root, path: number[] = []): boolean {
    if (!node) {
      console.log(`Path: ${path.join(' -> ')} | Value not found`);
      return false;
    }

    path.push(node.value);

    if (value === node.value) {
      console.log(`Found ${value}. Path: ${path.join(' -> ')}`);
      return true;
    } else if (value < node.value) {
      return this.search(value, node.left, path);
    } else {
      return this.search(value, node.right, path);
    }
  }

  insert(value: number): void {
    const insertNode = (node: TreeNode | null, val: number): TreeNode => {
      if (!node) return new TreeNode(val);
      if (val < node.value) node.left = insertNode(node.left, val);
      else if (val > node.value) node.right = insertNode(node.right, val);
      return node;
    };

    if (!this.numbers.includes(value)) {
      this.numbers.push(value);
      this.numbers.sort((a, b) => a - b);
      this.root = this.buildBalancedBST(this.numbers);
      console.log(`Inserted ${value}, tree rebuilt.`);
    } else {
      console.log(`Value ${value} already exists.`);
    }
  }

  remove(value: number): void {
    if (!this.numbers.includes(value)) {
      console.log(`Value ${value} not found.`);
      return;
    }
    this.numbers = this.numbers.filter((v) => v !== value);
    this.root = this.buildBalancedBST(this.numbers);
    console.log(`Removed ${value}, tree rebuilt.`);
  }

  testSearch() {
    const randomValue = this.numbers[Math.floor(Math.random() * this.numbers.length)];
    console.log(`Searching for ${randomValue}`);
    this.search(randomValue);
  }

  testInsert() {
    const newVal = Math.floor(Math.random() * 1000);
    this.insert(newVal);
  }

  testRemove() {
    const toRemove = this.numbers[Math.floor(Math.random() * this.numbers.length)];
    this.remove(toRemove);
  }


}
