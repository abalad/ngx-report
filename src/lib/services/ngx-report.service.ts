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
  public title = 'NGX REPORT';

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

  /* Content Default Properties */
  public body = { padding: {top: '0mm', right: '0mm', bottom: '0mm', left: '0mm'} };

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
      if (configuration.hasOwnProperty('body')) {
        this.body = configuration.body;
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
      body: this.body,
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
    const marginTop = !configuration.marginless ? configuration.margin.top : '5mm';
    const marginBottom = !configuration.marginless ? configuration.margin.bottom : '5mm';
    const marginRight = !configuration.marginless ? configuration.margin.right : '5mm';
    const marginLeft = !configuration.marginless ? configuration.margin.left : '5mm';
    const height = 'calc( 296mm - ' + marginTop + ' - ' + marginBottom + ')';

    return `<html lang="pt">
              <head>
              <meta charset="utf-8">
              <title>${configuration.title}</title>
               <!-- Normalize or reset CSS with your favorite library -->
              <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css">
              <style>
              .toolbar{
                background-color: #FFF;
                box-shadow: 0 0.5mm 2mm rgba(0,0,0,.3);
                position: fixed;
                top: 0;
                height: 75px;
                width: 100%;
                z-index: 1;
              }
              .sheet {
                margin: 0;
                overflow: hidden;
                position: relative;
                box-sizing: border-box;
                page-break-after: always;
              }

              /** Body sizes **/
              body { margin: 0; background: #e0e0e0 !important;  }
              body.A4.portrait .sheet { width: 210mm; height: 296mm }
              body.A4.landscape .sheet { width: 297mm; height: 209mm }

              /** For print **/
              @page {
                margin-top: ${marginTop};
                margin-right: ${marginRight};
                margin-bottom: ${marginBottom};
                margin-left: ${marginLeft};
                size: A4 ${configuration.orientation};
                page-break-before: always;
              }

              /** For screen preview **/
              @media screen {
                body { background: #e0e0e0 }
                .sheet {
                  background: white;
                  box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
                  margin: 5mm auto;
                  /*margin-top: 100px;*/
                }
              }

              /** Fix for Chrome issue #273306 **/
              @media print {
                body.A4.landscape { width: 297mm  }
                body.A4.portrait { width: 210mm }
                body.A4.portrait .sheet { width: 210mm; height: ${height} }
                body{
                  background: #FFFFFF !important;
                }
                .toolbar{
                    display: none;
                }
              }
              </style>
              </head>
              <body class="A4 ${configuration.orientation}">
<!--                <div class="toolbar">-->
<!--                    ALGUMA COISA AQUI NESSA TOLBAR-->
<!--                </div>-->
                <section class="sheet" style="overflow: unset !important;"></section>
              </body>`;
  }
}

// https://www.smashingmagazine.com/2015/01/designing-for-print-with-css/
// https://www.sitepoint.com/css-printer-friendly-pages/
