import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout.component',
  imports: [],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})

export class LayoutComponent {
  constructor(private router: Router) {}

  moveToTask(taskNumber: string){
    this.router.navigate([taskNumber]);
  }
}
