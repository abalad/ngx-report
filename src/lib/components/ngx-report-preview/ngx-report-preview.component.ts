import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-report-preview',
  templateUrl: './ngx-report-preview.component.html',
  styleUrls: ['./ngx-report-preview.component.scss']
})
export class NgxReportPreviewComponent implements OnInit {

  @Input() headerHeight = '5cm';

  @Input() footerHeight = '5cm';

  @Input() content = 'CONTENT WHERE';

  @Input() headerContent = 'CONTENT WHERE';

  @Input() footerContent = 'CONTENT WHERE';

  @Input() margin = { top: '0cm', right: '0cm', bottom: '0cm', left: '0cm' };

  constructor() { }

  ngOnInit(): void {
  }

}
