import { Component, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';

@Component({
  selector: 'ngx-report-header',
  templateUrl: './ngx-report-header.component.html',
  styleUrls: ['./ngx-report-header.component.scss']
})
export class NgxReportHeaderComponent implements OnInit {

  constructor( public ngxReportService: NgxReportService ) { }

  ngOnInit(): void {
  }

}
