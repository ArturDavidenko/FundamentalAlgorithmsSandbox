import { Component, signal } from '@angular/core';
import { CodeRunner } from '../../services/code-runner.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-taks1',
  imports: [CommonModule],
  templateUrl: './taks1.html',
  styleUrl: './taks1.css'
})
export class Taks1 {
  inputValueToAdd = signal('');
  inputValueToInsert = signal('');
  inputValueToInsertIndex = signal('');
  inputValueToRemove = signal('');
  outputValue = signal<number[] | string>(''); 
  codeString = signal('');
  private list = new DoublyLinkedList<number | string>();
  private cyclicList = new CircularDoublyLinkedList<number>();

  constructor(private codeRunner: CodeRunner, private router: Router) {}

  ngOnInit() { 

    //this.list.displayHead();

    this.cyclicList.runCyclicList();
    // this.list.add(10);
    // this.list.add(20);
    // this.list.add(30);

    // this.outputValue.set(this.list.getStringToShow())
    // this.codeString.set(this.codeRunner.getFunctionAsString(list.add))
    // this.codeString.set(this.codeRunner.getFunctionAsString(list.insert))
    // this.codeString.set(this.codeRunner.getFunctionAsString(list.remove))
  }

  clearAllList(){
    this.list.clear();
    this.list.display();
    this.outputValue.set(this.list.getStringToShow())
    this.codeString.set(this.codeRunner.getFunctionAsString(this.list.clear))
  }

  runAdd() {
    const input = this.inputValueToAdd(); 
    if (input != ""){
      this.list.add(input);
    }
    
    this.list.display();

    this.codeString.set(this.codeRunner.getFunctionAsString(this.list.add))
    this.outputValue.set(this.list.getStringToShow())
    this.list.displayHead();
  }

  runInsert(){
    const input = this.inputValueToInsert();
    const index =  Number(this.inputValueToInsertIndex()); 
    if (input != ""){
      this.list.insert(index, input);
    }

    this.list.display();

    this.codeString.set(this.codeRunner.getFunctionAsString(this.list.insert))
    this.outputValue.set(this.list.getStringToShow())
  }
  
  runRemove(){
     const input = this.inputValueToRemove();
     if (input != ""){
      this.list.remove(input);
    }

    this.list.display();
    this.codeString.set(this.codeRunner.getFunctionAsString(this.list.remove))
    this.outputValue.set(this.list.getStringToShow())
  }

  back() {
    this.router.navigate(['layout']);
  }
}

class DoublyNode<T> {
    data: T;
    prev: DoublyNode<T> | null;
    next: DoublyNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.prev = null;
        this.next = null;
    }
}

class DoublyLinkedList<T> {
    private head: DoublyNode<T> | null = null;
    private tail: DoublyNode<T> | null = null;

    add(data: T): void {
        const newNode = new DoublyNode(data);

        if (!this.head) {
            this.head = this.tail = newNode;
        } else {
            newNode.prev = this.tail;
            if (this.tail) this.tail.next = newNode;
            this.tail = newNode;
        }
    }

    insert(index: number, data: T): void {
        const newNode = new DoublyNode(data);

        if (index === 0) {
            newNode.next = this.head;
            if (this.head) this.head.prev = newNode;
            this.head = newNode;
            if (!this.tail) this.tail = newNode;
            return;
        }

        let current = this.head;
        let i = 0;

        while (current && i < index) {
            current = current.next;
            i++;
        }

        if (!current) {
            this.add(data);
            return;
        }

        newNode.prev = current.prev;
        newNode.next = current;
        if (current.prev) current.prev.next = newNode;
        current.prev = newNode;
    }

    remove(data: T): void {
        let current = this.head;

        while (current) {
            if (current.data === data) {
                if (current.prev) {
                    current.prev.next = current.next;
                } else {
                    this.head = current.next;
                }

                if (current.next) {
                    current.next.prev = current.prev;
                } else {
                    this.tail = current.prev;
                }
                return;
            }
            current = current.next;
        }
    }

    display(): void {
        let current = this.head;
        const elements: T[] = [];
        while (current) {
            elements.push(current.data);
            current = current.next;
        }

        console.log(elements.join(" <-> "));
    }

    displayHead(): void{
      console.log("CURRENT HEAD", this.head);
    }

    getStringToShow(): string{
      let current = this.head;
        const elements: T[] = [];
        while (current) {
            elements.push(current.data);
            current = current.next;
        }
        return elements.join(" <-> ");
    }

    clear(): void {
      this.head = null;
      this.tail = null;
    }
}

class CircularDoublyLinkedList<T> {
  private head: DoublyNode<T> | null = null;
  private tail: DoublyNode<T> | null = null;

  add(data: T): void {
    const newNode = new DoublyNode(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
    } else {
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.tail!.next = newNode;
      this.head!.prev = newNode;
      this.tail = newNode;
    }
  }

  insert(index: number, data: T): void {
    if (!this.head || index <= 0) {
      this.addToHead(data);
      return;
    }

    const newNode = new DoublyNode(data);
    let current = this.head;
    let i = 0;

    while (i < index && current!.next !== this.head) {
      current = current!.next!;
      i++;
    }

    if (i < index && current === this.tail) {
      this.add(data);
      return;
    }

    newNode.prev = current!.prev;
    newNode.next = current;
    current!.prev!.next = newNode;
    current!.prev = newNode;
  }

  private addToHead(data: T): void {
    const newNode = new DoublyNode(data);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = newNode;
      newNode.prev = newNode;
    } else {
      newNode.next = this.head;
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.head!.prev = newNode;
      this.head = newNode;
    }
  }

  remove(data: T): void {
    if (!this.head) return;

    let current = this.head;
    do {
      if (current.data === data) {
        if (current === this.head && current === this.tail) {
          this.head = null;
          this.tail = null;
          return;
        }

        current.prev!.next = current.next;
        current.next!.prev = current.prev;

        if (current === this.head) this.head = current.next;
        if (current === this.tail) this.tail = current.prev;
        return;
      }
      current = current.next!;
    } while (current !== this.head);
  }

  print(): void {
    if (!this.head) {
      console.log('List is empty.');
      return;
    }

    const values: T[] = [];
    let current = this.head;

    do {
      values.push(current.data);
      current = current.next!;
    } while (current !== this.head);

    console.log('Circular List:', values.join(' <-> ') + ` -> back to the start ${this.head.data} -> ...`);
    console.log("current HEAD: ", this.head)
  }

  runCyclicList(): void{
    const list = new CircularDoublyLinkedList<number>();

    list.add(10);
    list.add(20);
    list.add(30);
    list.print(); 

    list.insert(1, 15);
    list.print();

    console.log("Remove first element")
    list.remove(10);
    list.print();

  }
}
