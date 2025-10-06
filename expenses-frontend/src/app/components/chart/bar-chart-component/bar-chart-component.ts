import { Component, Input } from '@angular/core';
import { ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bar-chart-component',
  standalone: false,
  templateUrl: './bar-chart-component.html',
  styleUrl: './bar-chart-component.css'
})
export class BarChartComponent {
  @Input() data: { name: string; value: number }[] = [];
  @Input() xFmt: (val: any) => string = (v) => v;
  
   colorScheme: { name: string; selectable: boolean; group: ScaleType; domain: string[] } = {
    name: 'customIncome',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4caf50','#2196f3','#ff9800','#9c27b0','#f44336','#00acc1','#8bc34a','#ffc107']
  };
}
