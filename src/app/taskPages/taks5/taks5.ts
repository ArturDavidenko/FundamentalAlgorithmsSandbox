import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-taks5',
  imports: [CommonModule, FormsModule],
  templateUrl: './taks5.html',
  styleUrl: './taks5.css'
})
export class Taks5 {
  string1: string = 'kitten';
  string2: string = 'sitting';
  distance: number = 0;
  calculationSteps: string[] = [];
  matrix: number[][] = [];
  currentCell: {i: number, j: number, type: string} | null = null;
  matrixData: {value: number, isCurrent: boolean, isDiagonal: boolean, isLeft: boolean, isTop: boolean, isFinal: boolean}[][] = [];

  searchPhrase: string = 'music';
  data: { word: string; distance: number; visible: boolean }[] = [
    { word: 'musician', distance: 0, visible: true },
    { word: 'musical', distance: 0, visible: true },
    { word: 'museum', distance: 0, visible: true },
    { word: 'mouse', distance: 0, visible: true },
    { word: 'mic', distance: 0, visible: true },
    { word: 'muse', distance: 0, visible: true }
  ];

  ngOnInit() {
    this.calculateDistance();
    this.updateTableVisibility();
  }

  levenshteinDistance(str1: string, str2: string): number {
    this.calculationSteps = [];
    this.matrix = [];
    this.currentCell = null;
    this.matrixData = [];

    const len1 = str1.length;
    const len2 = str2.length;

    const matrix: number[][] = [];
    for (let i = 0; i <= len1; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= len2; j++) {
      matrix[0][j] = j;
    }

    for (let i = 0; i <= len1; i++) {
      this.matrixData[i] = [];
      for (let j = 0; j <= len2; j++) {
        this.matrixData[i][j] = {
          value: matrix[i][j],
          isCurrent: false,
          isDiagonal: false,
          isLeft: false,
          isTop: false,
          isFinal: false
        };
      }
    }

    this.calculationSteps.push('Initialized matrix with base cases');
    this.matrix = JSON.parse(JSON.stringify(matrix));

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        
        const top = matrix[i - 1][j] + 1;
        const left = matrix[i][j - 1] + 1;
        const diagonal = matrix[i - 1][j - 1] + cost;
        
        matrix[i][j] = Math.min(top, left, diagonal);
        
        let operationType = '';
        if (matrix[i][j] === diagonal) {
          operationType = 'diagonal';
        } else if (matrix[i][j] === left) {
          operationType = 'left';
        } else {
          operationType = 'top';
        }
        
        this.updateMatrixData(matrix, i, j, operationType);
        
        this.calculationSteps.push(
          `[${i},${j}]: '${str1[i-1]}' vs '${str2[j-1]}' | cost=${cost} | value=${matrix[i][j]}`
        );
        
        this.matrix = JSON.parse(JSON.stringify(matrix));
      }
    }

    this.matrixData[len1][len2].isFinal = true;
    this.matrixData[len1][len2].isCurrent = false;
    this.matrixData[len1][len2].isDiagonal = false;
    this.matrixData[len1][len2].isLeft = false;
    this.matrixData[len1][len2].isTop = false;

    this.distance = matrix[len1][len2];
    this.currentCell = null;
    this.calculationSteps.push(`Final distance: ${this.distance}`);
    return this.distance;
  }

  updateMatrixData(matrix: number[][], i: number, j: number, operationType: string) {
    for (let x = 0; x < this.matrixData.length; x++) {
      for (let y = 0; y < this.matrixData[x].length; y++) {
        this.matrixData[x][y].isCurrent = false;
        this.matrixData[x][y].isDiagonal = false;
        this.matrixData[x][y].isLeft = false;
        this.matrixData[x][y].isTop = false;
        this.matrixData[x][y].value = matrix[x][y];
      }
    }

    this.matrixData[i][j].isCurrent = true;
    
    if (operationType === 'diagonal') {
      this.matrixData[i][j].isDiagonal = true;
    } else if (operationType === 'left') {
      this.matrixData[i][j].isLeft = true;
    } else if (operationType === 'top') {
      this.matrixData[i][j].isTop = true;
    }
  }

  calculateDistance() {
    this.levenshteinDistance(this.string1, this.string2);
  }

  updateTableVisibility() {
    this.data.forEach(item => {
      item.distance = this.simpleLevenshtein(this.searchPhrase, item.word);
      item.visible = item.distance <= 3;
    });
  }

  private simpleLevenshtein(str1: string, str2: string): number {
    const len1 = str1.length;
    const len2 = str2.length;
    
    const matrix: number[][] = [];
    for (let i = 0; i <= len1; i++) matrix[i] = [i];
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }
    
    return matrix[len1][len2];
  }

  getRowClass(distance: number): string {
    if (distance === 0) return 'table-success';
    if (distance <= 2) return 'table-warning';
    if (distance <= 3) return 'table-info';
    return 'table-danger';
  }

  getMatrixCellClass(cell: any): string {
    if (cell.isFinal) return 'bg-warning text-dark';
    if (cell.isCurrent && cell.isDiagonal) return 'bg-success text-white';
    if (cell.isCurrent && cell.isLeft) return 'bg-info text-white';
    if (cell.isCurrent && cell.isTop) return 'bg-secondary text-white';
    if (cell.isCurrent) return 'bg-primary text-white';
    return '';
  }
}
