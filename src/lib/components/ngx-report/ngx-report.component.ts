import { Component, Input, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';
import { ReportServiceConfig } from '../../classes/report-service-config';

@Component({
  selector: 'ngx-report',
  templateUrl: './ngx-report.component.html',
  styleUrls: ['./ngx-report.component.scss']
})
export class NgxReportComponent implements OnInit {

  margin = new ReportServiceConfig().margin;

  constructor( private ngxService: NgxReportService ) { }

  ngOnInit(): void {
    this.margin = this.ngxService.margin;
  }

}
