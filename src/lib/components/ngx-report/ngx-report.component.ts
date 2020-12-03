import { AfterContentInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgxReportService } from '../../services/ngx-report.service';

@Component({
  selector: 'ngx-report',
  templateUrl: './ngx-report.component.html',
  styleUrls: ['./ngx-report.component.scss']
})
export class NgxReportComponent {

  margin: any;

  constructor( private ngxService: NgxReportService ) {
    this.margin = this.ngxService.margin;
  }

}
