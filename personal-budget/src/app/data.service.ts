import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = 'http://localhost:3000/budget';
  // D3js Chart Data
  private budgetData: any[] = [];
  // Pie Chart Data
  private dataSource = {
    labels: [''],
    datasets: [
      {
        data: [''],
        backgroundColor: [
          '#4caf50',
          '#2196f3',
          '#ff9800',
          '#9c27b0',
          '#e91e63',
          '#00bcd4',
          '#ffc107'
        ],
      }
    ]
  };

  constructor(private http: HttpClient) { }

  getBudgetData(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  populateDataSource(data: any): void {
    for (var i = 0; i < data.length; i++) {
      this.dataSource.datasets[0].data[i] = data[i].budget;
      this.dataSource.labels[i] = data[i].title;
    }
  }

  getDataSource(): any {
    return this.dataSource;
  }

  setBudgetData(data: any[]): void {
    this.budgetData = data;
    this.populateDataSource(data);
  }

  getStoredBudgetData(): any[] {
    return this.budgetData;
  }

  isBudgetDataEmpty(): boolean {
    return this.budgetData.length === 0;
  }

  getBudget(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
