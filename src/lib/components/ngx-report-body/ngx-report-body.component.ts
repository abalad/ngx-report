import { Component, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';

@Component({
  selector: 'ngx-report-body',
  templateUrl: './ngx-report-body.component.html',
  styleUrls: ['./ngx-report-body.component.scss']
})
export class NgxReportBodyComponent implements OnInit {

  constructor( private ngxService: NgxReportService ) { }

  ngOnInit(): void {
  }

}
