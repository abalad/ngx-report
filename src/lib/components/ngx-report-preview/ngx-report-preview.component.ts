import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-report-preview',
  templateUrl: './ngx-report-preview.component.html',
  styleUrls: ['./ngx-report-preview.component.scss']
})
export class NgxReportPreviewComponent implements OnInit {

  @Input() preview = { height: '600px', width: '290px', scale: 0.361, position: 'top left' };

  @Input() margin = { top: '0cm', right: '0cm', bottom: '0cm', left: '0cm' };

  @Input() header = { height: '5cm', content: 'CONTENT WHERE'};

  @Input() footer = { height: '5cm', content: 'CONTENT WHERE'};

  @Input() content = { content: 'CONTENT WHERE'};

  constructor() { }

  ngOnInit(): void {
  }

}
