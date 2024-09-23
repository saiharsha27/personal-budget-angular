import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ArticleComponent } from '../article/article.component';
import { registerables } from 'chart.js';
import { Chart } from 'chart.js/auto';
import * as d3 from 'd3';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../data.service';

interface BudgetData {
  myBudget: { title: string; budget: number }[];
}

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
  budgetData: BudgetData;

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

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: any, private dataService: DataService) {
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
      this.createChart();
      this.fetchBudgetData();
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

  fetchBudgetData(): void {
    this.dataService.getBudgetData()
      .subscribe(data => {
        this.budgetData = data;
        if (isPlatformBrowser(this.platformId)) {
          this.generateChart();
        }
      });
  }

  generateChart(): void {
    if (!this.budgetData || !this.budgetData.myBudget || this.budgetData.myBudget.length === 0) {
      console.error('Budget Data is empty.');
      return;
    }

    const width = 800;
    const height = 500;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal<string>()
      .domain(this.budgetData.myBudget.map(item => item.title))
      .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

    const pie = d3.pie<number>()
      .sort(null)
      .value((d: any) => d);

    const arc = d3.arc<any, d3.DefaultArcObject>()
      .outerRadius(radius * 0.8)
      .innerRadius(radius * 0.4);

    const outerArc = d3.arc<any, d3.DefaultArcObject>()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    const svg = d3.select('#d3Chart')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arcs = svg.selectAll('.arc')
      .data(pie(this.budgetData.myBudget.map(item => item.budget)))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', (d: any) => arc(d))
      .attr('fill', (d: any, i: number) => color(this.budgetData.myBudget[i].title));

    const labelArc = d3.arc<any, d3.DefaultArcObject>()
      .outerRadius(radius * 1.0)
      .innerRadius(radius * 0.9);

    arcs.append('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .style('text-anchor', 'middle')
      .text((d: any, i: number) => this.budgetData.myBudget[i].title);

    arcs.append('polyline')
      .attr('points', (d: any) => {
        const pos = outerArc.centroid(d);
        return [arc.centroid(d), outerArc.centroid(d), pos].join(' ');
      })
      .style('fill', 'none')
      .style('stroke', '#666')
      .style('stroke-width', '1px');
  }

}
