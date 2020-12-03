import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-report-base',
  templateUrl: './ngx-report-base.component.html',
  styleUrls: ['./ngx-report-base.component.scss']
})
export class NgxReportBaseComponent implements OnInit {

  @Input() properties: any;

  @Input() configuration: any;

  constructor() { }

  ngOnInit(): void {
  }

}
