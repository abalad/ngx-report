import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ReportServiceConfig } from './classes/report-service-config';
import { NgxReportBodyComponent } from './components/ngx-report-body/ngx-report-body.component';
import { NgxReportFooterComponent } from './components/ngx-report-footer/ngx-report-footer.component';
import { NgxReportHeaderComponent } from './components/ngx-report-header/ngx-report-header.component';
import { NgxReportComponent } from './components/ngx-report/ngx-report.component';
import { NgxReportBaseComponent } from './components/ngx-report-base/ngx-report-base.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    NgxReportComponent,
    NgxReportBodyComponent,
    NgxReportFooterComponent,
    NgxReportHeaderComponent,
    NgxReportBaseComponent
  ],
  exports: [
    NgxReportComponent,
    NgxReportBodyComponent,
    NgxReportFooterComponent,
    NgxReportHeaderComponent
  ]
})
export class NgxReportModule {
  static forRoot(config: ReportServiceConfig): ModuleWithProviders<NgxReportModule> {
    return {
      ngModule: NgxReportModule,
      providers: [{ provide: ReportServiceConfig, useValue: config }]
    };
  }
}
