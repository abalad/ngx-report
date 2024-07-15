/**
 * Enum for Impression Type
 */
export enum ImpressionType {
  DefaultA4 = 'DefaultA4',
  CustomPrinter = 'CustomPrinter'
}
/**
 * Config for service - used in forRoot
 */
export class ReportServiceConfig {
  /** Active/Desactive Debug Mode */
  debug ? = false;

  /** Print in a new window or not */
  printOpenWindow ? = true;

  /** Wait time before opening print dialog */
  timeToWaitRender ? = 200;

  /** Class name to be used when printing in current window */
  renderClass ?: string;

  /* Name ofapp route component - usally 'app-root' used by print to same window */
  appRootName ?  = 'app-root';

  /* Just show preview without fireing the print command - default is false */
  printPreviewOnly ? = false;

  /* Default Title to Window */
  title ? = 'NGX REPORT';

  /* Default Orientation Configurations */
  orientation ?: 'portrait' | 'landscape' = 'portrait';

  /* Margin Default of Page */
  margin ? = { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' };

  /* Default Header Configurations */
  header ? = { height: '30mm' };

  /* Default Footer Configurations */
  footer ? = { height: '30mm' };

  /* Content Default Properties */
  body ? = { padding: {top: '0mm', right: '0mm', bottom: '0mm', left: '0mm'} };

  /* Default Impression Type */
  impressionType ?: ImpressionType = ImpressionType.DefaultA4;

  /* Print Without Margin */
  marginless ? = false;
}

