import { Component, ElementRef, Inject, Input, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { registerables } from 'chart.js';
import { Chart } from 'chart.js/auto';

// import { Component, ElementRef, OnInit, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [ArticleComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  canvas: any;
  ctx: any;
  response: any;

  mychart: any;
  public dataSource = {
    datasets: [
      {
        data: [''],
        backgroundColor: [
          '#ffcd56',
          '#ff6384',
          '#36a2eb',
          '#fd6b19',
          'rgb(200, 99, 100)',
          'rgb(210, 110, 90)',
          'rgb(255, 205, 86)'
        ]
      }
    ],
    labels: ['']
  };


  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any) {
    Chart.register(...registerables);
  }
  ngOnInit(): void {

    this.http.get('http://localhost:3000/budget')
      .subscribe((res: any) => {
        for (let i = 0; i < res.myBudget.length; i++) {
          this.dataSource.datasets[0].data.push(res.myBudget[i].budget);
          this.dataSource.labels.push(res.myBudget[i].title);
        }
      });

  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createChart()
    }, 1000);
  }

  createChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const ctx = <HTMLCanvasElement>document.getElementById('myChart');
      var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource,
      });
    }
  }

}
