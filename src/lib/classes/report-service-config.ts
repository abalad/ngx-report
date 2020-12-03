/**
 * Config for service - used in forRoot
 */
export class ReportServiceConfig {
  /** Print in a new window or not */
  printOpenWindow ? = true;

  /** Wait time before opening print dialog */
  timeToWaitRender ? = 200;

  /** Class name to be used when printing in current window */
  renderClass?: string;

  /* Name ofapp route component - usally 'app-root' used by print to same window */
  appRootName ?  = 'app-root';

  /* Just show preview without fireing the print command - default is false */
  printPreviewOnly ? = false;
}
