import { Component, ElementRef, HostListener, Input, SimpleChanges } from '@angular/core';
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
  @Input() baseHeight = 320;
  @Input() perBar = 28;

  width = 600;
  height = 320;

  
   colorScheme: { name: string; selectable: boolean; group: ScaleType; domain: string[] } = {
    name: 'customIncome',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#4caf50','#2196f3','#ff9800','#9c27b0','#f44336','#00acc1','#8bc34a','#ffc107']
  };

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit(): void { this.computeSize(); }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.data = [...(this.data || [])];
      this.computeSize();
      setTimeout(() => this.computeSize(), 0);
    }
  }

  @HostListener('window:resize') onResize() { this.computeSize(); }

  private computeSize() {
    const hostBody = this.el.nativeElement.closest('.card-body') as HTMLElement | null;
    const host = hostBody || this.el.nativeElement.parentElement || this.el.nativeElement;
    const w = Math.max(360, Math.floor((host?.clientWidth || 600) - 16));
    const n = Math.max(2, this.data?.length || 0);
    const h = Math.max(this.baseHeight, Math.min(900, Math.round(this.baseHeight + (n - 6) * this.perBar)));
    this.width = w;
    this.height = h;
  }
  
}
