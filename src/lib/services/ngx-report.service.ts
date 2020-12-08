import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector, Optional,
  Type,
} from '@angular/core';
import { ReportServiceConfig } from '../classes/report-service-config';

@Injectable({
  providedIn: 'root'
})
export class NgxReportService {
  /**
   * Active or Desactive Debug Mode
   * Default is false
   */
  public debug = false;

  /**
   * Do not fire print event - just show preview
   * Default is false
   */
  public printPreviewOnly = false;

  /**
   * Wait time to render before open print dialog in ms
   * Default is 200
   */
  public timeToWaitRender = 500;

  /**
   * Open new window to print or not
   * Default is true
   */
  public printOpenWindow = true;

  /**
   * Name of root component
   * Default is app-root
   */
  public appRootName = 'app-root';

  /**
   * Page Configuration
   * Default is PageConfig
   */
  public margin = { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' };

  /**
   * Default Title of Window
   */
  public title = 'NGXS REPORT';

  /**
   * Print Without Margin
   */
  public marginless = false;

  /**
   * Default Header Configurations
   */
  public header = { height: '30mm' };

  /**
   * Default Footer Configurations
   */
  public footer = { height: '30mm' };

  /**
   * Default Orientation Configurations
   */
  public orientation: 'portrait' | 'landscape' = 'portrait';

  /**
   * Class used in component when printing to current window
   */
  renderClass = 'default';

  window: Window;

  appRoot: HTMLElement;

  appRootDislaySetting = '';

  eventadded = [];

  freezedConfiguration: ReportServiceConfig;

  constructor(
    @Optional() config: ReportServiceConfig,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef ) {
      this.setRootConfigOptions(config);
  }

  /**
   * Print Angular Component
   * @example
   * this.printerService.printComponent(MyComponentPage);
   * @param component
   * @param properties
   * @param configuration
   */
  printComponent(component: Type<any>, properties, configuration = this.getDefaultConfiguration() ) {
    this.freezeConfiguration();
    this.setRootConfigOptions(configuration);
    configuration = this.getDefaultConfiguration();
    const componentRef = this.createComponent(component, properties, configuration);
    this.print(componentRef.location.nativeElement, this.printOpenWindow, configuration);
    this.unFreezeConfiguration();
  }

  /**
   * Load Page Default Configuration
   * @example
   * this.printerService.loadPageConfiguration( {margin: { top: '0mm'} });
   * @param configuration
   */
  loadDefaultConfiguration(configuration: ReportServiceConfig) {
    this.setRootConfigOptions(configuration);
  }

  /**
   * Set config from forRoot
   * @param configuration
   */
  private setRootConfigOptions(configuration: ReportServiceConfig): void {
    if (configuration) {
      if (configuration.hasOwnProperty('debug')) {
        this.debug = configuration.debug;
      }
      if (configuration.hasOwnProperty('printOpenWindow')) {
        this.printOpenWindow = configuration.printOpenWindow;
      }
      if (configuration.hasOwnProperty('timeToWaitRender')) {
        this.timeToWaitRender = configuration.timeToWaitRender;
      }
      if (configuration.hasOwnProperty('renderClass')) {
        this.renderClass = configuration.renderClass;
      }
      if (configuration.hasOwnProperty('appRootName')) {
        this.appRootName = configuration.appRootName;
      }
      if (configuration.hasOwnProperty('printPreviewOnly')) {
        this.printPreviewOnly = configuration.printPreviewOnly;
      }
      if (configuration.hasOwnProperty('title')) {
        this.title = configuration.title;
      }
      if (configuration.hasOwnProperty('margin')) {
        this.margin = configuration.margin;
      }
      if (configuration.hasOwnProperty('header')) {
        this.header = configuration.header;
      }
      if (configuration.hasOwnProperty('footer')) {
        this.footer = configuration.footer;
      }
      if (configuration.hasOwnProperty('orientation')) {
        this.orientation = configuration.orientation;
      }
      if (configuration.hasOwnProperty('marginless')) {
        this.marginless = configuration.marginless;
      }
    }
  }

  /**
   * Get config to configuration
   */
  private getDefaultConfiguration(): ReportServiceConfig {
    return {
      debug: this.debug,
      printOpenWindow: this.printOpenWindow,
      timeToWaitRender: this.timeToWaitRender,
      renderClass: this.renderClass,
      appRootName: this.appRootName,
      printPreviewOnly: this.printPreviewOnly,
      title: this.title,
      margin: this.margin,
      header: this.header,
      footer: this.footer,
      orientation: this.orientation,
      marginless: this.marginless,
    };
  }

  /**
   * Main print function
   * @param printContent
   * @param printOpenWindow
   * @param configuration
   */
  private print(printContent: any, printOpenWindow: boolean, configuration: ReportServiceConfig): void {
    if (printOpenWindow === true) {
      this.printInNewWindow(printContent, configuration);
    }
  }

  private getStyleSheetElement() {
    const styleSheetElement = document.createElement('link');
    document.querySelectorAll('link').forEach(htmlElement => {
      if (htmlElement.rel === 'stylesheet') {
        const absoluteUrl = new URL(htmlElement.href).href;
        styleSheetElement.rel = 'stylesheet';
        styleSheetElement.href = absoluteUrl;
      }
    });
    return styleSheetElement;
  }

  /**
   * Print using a new window / tab
   * @param content
   * @param configuration
   */
  private printInNewWindow(content: HTMLElement, configuration: ReportServiceConfig): void {
    this.window = null;
    this.window = window.open('', 'target', 'toolbar=0,height=600,width=1024');
    this.window.document.write( this.getBodyContent( configuration ) );
    this.window.document.body.querySelector('section').appendChild(content);
    document.querySelectorAll('style').forEach(htmlElement => {
      this.window.document.head.appendChild(htmlElement.cloneNode(true));
    });
    this.window.document.head.appendChild( this.getStyleSheetElement() );
    this.window.document.close();
    setTimeout(
      () => this.printTabWindow(this.window, this.window.document),
      this.timeToWaitRender
    );
  }

  /**
   * Print window in new tab
   */
  private printTabWindow(printWindow: Window, printWindowDoc: Document): void {
    if (this.printPreviewOnly) {
      return;
    }
    this.registerPrintEvent(printWindow, true);
    printWindow.focus();
    if (printWindowDoc.execCommand('print') === false) {
      printWindow.print();
    }
  }

  /**
   * Listen to print event of window
   * @param printWindow
   * @param printWithOpenInNewWindow
   */
  private registerPrintEvent(printWindow: Window, printWithOpenInNewWindow: boolean) {
    printWindow.focus();
    if (this.eventadded[printWindow.name]) {
      return;
    }
    printWindow.addEventListener('afterprint', () => {
      this.eventadded[ printWindow.name ] = !printWithOpenInNewWindow;
      this.cleanUp(printWindow, printWithOpenInNewWindow);
    });
  }

  /**
   * Close tab or clean up dom
   * @internal
   */
  private cleanUp(printWindow: Window, printOpenWindow: boolean): void {
    if (printOpenWindow === true && !this.debug) {
      printWindow.close();
      setTimeout(() => {
        printWindow.close();
      }, 20);
    }
  }

  private createComponent( component, properties, configuration ) {
    const factory = this.resolver.resolveComponentFactory( component );
    const componentRef = factory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    componentRef.instance['properties'] = properties;
    componentRef.instance['configuration'] = configuration;
    return componentRef;
  }

  private freezeConfiguration() {
    this.freezedConfiguration = this.getDefaultConfiguration();
  }

  private unFreezeConfiguration() {
    this.setRootConfigOptions( this.freezedConfiguration );
  }

  private getBodyContent( configuration: ReportServiceConfig ) {
    return `<html lang="pt">
              <head>
              <meta charset="utf-8">
              <title>${configuration.title}</title>
               <!-- Normalize or reset CSS with your favorite library -->
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
              <style>
              @page {
                margin-top: ${!configuration.marginless ? configuration.margin.top : '0mm'};
                margin-right: ${!configuration.marginless ? configuration.margin.right : '0mm'};
                margin-bottom: ${!configuration.marginless ? configuration.margin.bottom : '0mm'};
                margin-left: ${!configuration.marginless ? configuration.margin.left : '0mm'};
                size: A4 ${configuration.orientation};
                page-break-before: always;
              }
              body { margin: 0; background: #e0e0e0 !important;  }
              .sheet {
                margin: 0;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
                page-break-after: always;
              }

              /** Paper sizes **/
              body.A3               .sheet { width: 297mm; height: 419mm }
              body.A3.landscape     .sheet { width: 420mm; height: 296mm }
              body.A4.portrait      .sheet { width: 210mm; height: 296mm }
              body.A4.landscape     .sheet { width: 297mm; height: 209mm }
              body.A5               .sheet { width: 148mm; height: 209mm }
              body.A5.landscape     .sheet { width: 210mm; height: 147mm }
              body.letter           .sheet { width: 216mm; height: 279mm }
              body.letter.landscape .sheet { width: 280mm; height: 215mm }
              body.legal            .sheet { width: 216mm; height: 356mm }
              body.legal.landscape  .sheet { width: 357mm; height: 215mm }

              /** Padding area **/
              .sheet.padding-10mm { padding: 10mm }
              .sheet.padding-15mm { padding: 15mm }
              .sheet.padding-20mm { padding: 20mm }
              .sheet.padding-25mm { padding: 25mm }

              /** For screen preview **/
              @media screen {
                body { background: #e0e0e0 }
                .sheet {
                  background: white;
                  box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
                  margin: 5mm auto;
                }
              }

              /** Fix for Chrome issue #273306 **/
              @media print {
                body.A3.landscape                   { width: 420mm }
                body.A3, body.A4.landscape          { width: 297mm }
                body.A4.portrait, body.A5.landscape { width: 210mm }
                body.A5                             { width: 148mm }
                body.letter, body.legal             { width: 216mm }
                body.letter.landscape               { width: 280mm }
                body.legal.landscape                { width: 357mm }
                body{
                  background: #FFFFFF !important;
                }
              }
              </style>
              </head>
              <body class="A4 ${configuration.orientation}">
                <section class="sheet" style="overflow: unset !important;"></section>
              </body>`;
  }
}
