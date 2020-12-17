import { Component, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';

@Component({
  selector: 'ngx-report-body',
  templateUrl: './ngx-report-body.component.html',
  styleUrls: ['./ngx-report-body.component.scss']
})
export class NgxReportBodyComponent implements OnInit {

  public margin: any;

  public padding: any;

  public marginless: any;

  public header: any;

  public footer: any;

  constructor( public ngxReportService: NgxReportService ) {
    this.margin = this.ngxReportService.margin;
    this.padding = this.ngxReportService.body.padding;
    this.marginless = this.ngxReportService.marginless;
    this.header = this.ngxReportService.header;
    this.footer = this.ngxReportService.footer;
  }

  ngOnInit(): void {
  }

}
