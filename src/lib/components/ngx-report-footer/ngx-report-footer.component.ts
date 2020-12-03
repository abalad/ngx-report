import { Component, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';

@Component({
  selector: 'ngx-report-footer',
  templateUrl: './ngx-report-footer.component.html',
  styleUrls: ['./ngx-report-footer.component.scss']
})
export class NgxReportFooterComponent implements OnInit {

  constructor( public ngxReportService: NgxReportService ) { }

  ngOnInit(): void {
  }

}
