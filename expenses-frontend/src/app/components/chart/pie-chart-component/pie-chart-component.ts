import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pie-chart-component',
  standalone: false,
  templateUrl: './pie-chart-component.html',
  styleUrl: './pie-chart-component.css'
})
export class PieChartComponent {

  @Input() data: { name: string; value: number }[] = [];

   colorScheme = {
    domain: ['#4caf50','#2196f3','#ff9800','#9c27b0','#f44336','#00acc1','#8bc34a','#ffc107']
  };
}
