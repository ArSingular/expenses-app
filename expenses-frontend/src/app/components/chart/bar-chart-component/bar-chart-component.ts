import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bar-chart-component',
  standalone: false,
  templateUrl: './bar-chart-component.html',
  styleUrl: './bar-chart-component.css'
})
export class BarChartComponent {
  @Input() data: { name: string; value: number }[] = [];
  @Input() xFmt: (val: any) => string = (v) => v;

}
