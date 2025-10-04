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

  constructor(private codeRunner: CodeRunner, private router: Router) {}

  ngOnInit() { 
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
