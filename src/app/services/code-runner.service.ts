import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CodeRunner {

  runCode<TInput, TOutput>(fn: (input: TInput) => TOutput, input: TInput): TOutput {
    return fn(input);
  }

  getFunctionAsString(fn: Function): string {
    return fn.toString();
  }
}
