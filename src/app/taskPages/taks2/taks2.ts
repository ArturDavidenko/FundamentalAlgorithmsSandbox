import { Component, signal } from '@angular/core';
import { CodeRunner } from '../../services/code-runner.service';

@Component({
  selector: 'app-taks2',
  imports: [],
  templateUrl: './taks2.html',
  styleUrl: './taks2.css'
})
export class Taks2 {
  inputValue = signal('');
  outputValue = signal<number[] | string>('');

  constructor(private codeRunner: CodeRunner) {}

  
}
